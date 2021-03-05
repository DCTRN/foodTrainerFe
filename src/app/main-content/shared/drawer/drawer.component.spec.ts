import { DebugElement, Injectable, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from '@core/stores/user/user.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  MenuItems,
  NavigationMediatorService,
} from '../services/navigation-mediator/navigation-mediator.service';
import { DrawerComponent } from './drawer.component';

const userInitial: User = {
  username: 'mike8',
  email: 'michal.kowalski@gmail.com',
  phoneNumber: '123123123',
  birthDate: new Date(),
  firstName: 'majkel',
  lastName: 'majk',
  id: 5,
  authenticationLevel: 1,
};
export const initialState: any = {
  user: userInitial,
};

@Injectable()
class NavigationMediatorServiceMock {
  private currentlySelectedMenuItem$ = new BehaviorSubject<MenuItems>(
    MenuItems.DIARY
  );

  constructor(private router: Router) {}

  public setClickedMenuItem(menuItem: MenuItems): void {
    if (menuItem === MenuItems.LOG_OUT) {
      return;
    }
    this.currentlySelectedMenuItem$.next(menuItem);
  }

  public getCurrentlySelectedMenuItem$(): Observable<MenuItems> {
    return this.currentlySelectedMenuItem$.asObservable();
  }
}

describe('DrawerComponent', () => {
  let injector: TestBed;
  let component: DrawerComponent;
  let fixture: ComponentFixture<DrawerComponent>;
  let navigationMediatorService: NavigationMediatorService;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatIconModule,
        MatCardModule,
        MatDividerModule,
      ],
      declarations: [DrawerComponent],
      providers: [
        {
          provide: NavigationMediatorService,
          useClass: NavigationMediatorServiceMock,
        },
        provideMockStore({ initialState }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    store = injector.inject(MockStore);
    navigationMediatorService = injector.inject(NavigationMediatorService);
    fixture = injector.createComponent(DrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep currently selected menu item highlighted', () => {
    fixture.detectChanges();
    const diaryMenuItem = fixture.debugElement.queryAll(
      By.css('.drawer__content__item')
    )[0] as DebugElement;
    const classes = Object.keys(diaryMenuItem.classes);
    const isSelected = classes.find((c: string) => c === 'selected');

    expect(isSelected).toBeTruthy();
  });

  it('should notify about clicked item', () => {
    const setMenuItemSpy = spyOn(
      navigationMediatorService,
      'setClickedMenuItem'
    ).and.callThrough();

    fixture.detectChanges();
    component.onMenuItemClick(MenuItems.DIARY);
    fixture.detectChanges();
    const diaryMenuItem = fixture.debugElement.queryAll(
      By.css('.drawer__content__item')
    )[0] as DebugElement;
    const classes = Object.keys(diaryMenuItem.classes);
    const isSelected = classes.find((c: string) => c === 'selected');

    expect(isSelected).toBeTruthy();
    expect(setMenuItemSpy).toHaveBeenCalledWith(MenuItems.DIARY);
  });

  it('should fetch user credentials and dsiplay them', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    component.ngOnInit();
    fixture.detectChanges();

    expect(dispatchSpy).toBeTruthy();
    expect(component.user.username).toEqual(userInitial.username);
    expect(component.user.email).toEqual(userInitial.email);
  });
});
