import { DatePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ButtonAction } from '@core/models/products';
import { MealEatTimeType } from '@core/models/user-products';
import { ComponentLoaderService } from '@core/services/component-loader/component-loader.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { userProduct1 } from '@testsUT/user-products/user-products-mock-data.model';
import { DiaryComponent } from './diary.component';
import { MealsConatainerListComponent } from './meals-container-list/meals-conatainer-list.component';
import { MealContainerAction } from './meals-container/meals-container.component';
import { MealsSearchListComponent } from './meals-search-list/meals-search-list.component';

const initialState = { userProducts: { userProducts: [userProduct1] } };

describe('DiaryComponent', () => {
  let injector: TestBed;
  let component: DiaryComponent;
  let fixture: ComponentFixture<DiaryComponent>;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        ComponentLoaderService,
        DatePipe,
      ],
      declarations: [
        DiaryComponent,
        MealsConatainerListComponent,
        MealsSearchListComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    store = injector.inject(MockStore);
    fixture = TestBed.createComponent(DiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispath event for current products', () => {
    spyOn(store, 'dispatch');

    component.ngOnInit();
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should display meals container list for init', async () => {
    const mealContainerAction: MealContainerAction = {
      action: ButtonAction.ADD,
      mealEatTimeType: MealEatTimeType.BREAKFAST,
    };
    component.ngOnInit();
    fixture.detectChanges();

    await fixture.whenRenderingDone();

    const mealsConatainerListComponent = fixture.debugElement.query(
      By.directive(MealsConatainerListComponent)
    ).componentInstance as MealsConatainerListComponent;

    expect(mealsConatainerListComponent).toBeTruthy();
  });
});
