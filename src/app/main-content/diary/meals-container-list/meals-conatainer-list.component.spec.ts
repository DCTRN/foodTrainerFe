import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ButtonAction } from '@core/models/products';
import { MealEatTimeType } from '@core/models/user-products';
import { provideMockStore } from '@ngrx/store/testing';
import { MealsContainerComponent } from '@testsUT/user-products/user-products-mock-components.model';
import { userProduct5 } from '@testsUT/user-products/user-products-mock-data.model';
import { MealContainerAction } from '../meals-container/meals-container.component';
import { MealsConatainerListComponent } from './meals-conatainer-list.component';

const initialState = { userProducts: { userProducts: [userProduct5] } };

describe('MealsConatainerListComponent', () => {
  let component: MealsConatainerListComponent;
  let fixture: ComponentFixture<MealsConatainerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })],
      declarations: [MealsConatainerListComponent, MealsContainerComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MealsConatainerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all meal types containers', () => {
    const mealContainersTypes = Object.keys(MealEatTimeType);
    const mealContainers = fixture.debugElement
      .queryAll(By.directive(MealsContainerComponent))
      .map(
        (debugElement: DebugElement) =>
          debugElement.componentInstance as MealsContainerComponent
      );
    const mealContainersDisplayedTypes = mealContainers.reduce(
      (p: MealEatTimeType[], c) => [...p, c.mealEatTimeType],
      []
    );

    expect(mealContainers.length).toEqual(5);
    mealContainersTypes.forEach((type: MealEatTimeType) =>
      expect(mealContainersDisplayedTypes).toContain(type)
    );
  });

  it('should propagate action from meal container', () => {
    const action: MealContainerAction = {
      action: ButtonAction.ADD,
      mealEatTimeType: MealEatTimeType.BREAKFAST,
    };
    spyOn(component.action, 'emit');
    const mealContainer = fixture.debugElement.queryAll(
      By.directive(MealsContainerComponent)
    )[0].componentInstance as MealsContainerComponent;

    mealContainer.triggerAction(action);

    expect(component.action.emit).toHaveBeenCalledWith(action);
  });

  it('should calculate summarized ingredients for all user products', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.product.kcal).toEqual(userProduct5.product.kcal);
    expect(component.product.protein).toEqual(userProduct5.product.protein);
    expect(component.product.carbohydrates).toEqual(
      userProduct5.product.carbohydrates
    );
    expect(component.product.fats).toEqual(userProduct5.product.fats);
  });
});
