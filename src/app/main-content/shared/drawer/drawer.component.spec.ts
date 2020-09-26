import { DebugElement, Injectable, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  MenuItems,
  NavigationMediatorService,
} from '../services/navigation-mediator/navigation-mediator.service';
import { DrawerComponent } from './drawer.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

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
      ],
      // schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
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
    )[1] as DebugElement;
    const classes = Object.keys(diaryMenuItem.classes);
    const isSelected = classes.find((c: string) => c === 'selected');

    expect(isSelected).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should notify about clicked item', () => {
    const setMenuItemSpy = spyOn(
      navigationMediatorService,
      'setClickedMenuItem'
    ).and.callThrough();

    fixture.detectChanges();
    component.onMenuItemClick(MenuItems.MAIN_PAGE);
    fixture.detectChanges();
    const diaryMenuItem = fixture.debugElement.queryAll(
      By.css('.drawer__content__item')
    )[0] as DebugElement;
    const classes = Object.keys(diaryMenuItem.classes);
    const isSelected = classes.find((c: string) => c === 'selected');

    expect(isSelected).toBeTruthy();
    expect(setMenuItemSpy).toHaveBeenCalledWith(MenuItems.MAIN_PAGE);
    expect(component).toBeTruthy();
  });
});
