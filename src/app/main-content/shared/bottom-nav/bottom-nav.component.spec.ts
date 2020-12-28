import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement, Injectable, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  MenuItems,
  NavigationMediatorService,
} from '../services/navigation-mediator/navigation-mediator.service';
import { BottomNavComponent } from './bottom-nav.component';

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

describe('BottomNavComponent', () => {
  let injector: TestBed;
  let navigationMediatorService: NavigationMediatorService;
  let component: BottomNavComponent;
  let fixture: ComponentFixture<BottomNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [BottomNavComponent],
      providers: [
        {
          provide: NavigationMediatorService,
          useClass: NavigationMediatorServiceMock,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    navigationMediatorService = injector.inject(NavigationMediatorService);
    fixture = injector.createComponent(BottomNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep currently selected menu item highlighted', () => {
    fixture.detectChanges();
    const diaryMenuItem = fixture.debugElement.queryAll(
      By.css('.bottom-nav__item')
    )[0] as DebugElement;
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
    component.onMenuItemClick(MenuItems.DIARY);
    fixture.detectChanges();
    const diaryMenuItem = fixture.debugElement.queryAll(
      By.css('.bottom-nav__item')
    )[0] as DebugElement;
    const classes = Object.keys(diaryMenuItem.classes);
    const isSelected = classes.find((c: string) => c === 'selected');

    expect(isSelected).toBeTruthy();
    expect(setMenuItemSpy).toHaveBeenCalledWith(MenuItems.DIARY);
    expect(component).toBeTruthy();
  });
});
