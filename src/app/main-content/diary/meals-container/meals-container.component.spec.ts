import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ButtonAction } from '@core/models/products';
import { MealEatTimeType, UserProduct } from '@core/models/user-products';
import { UserProductsAction } from '@core/stores/user-products/user-products.actions';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ProductsListComponent } from '@testsUT/products/products-mock-components.model';
import {
  userProduct1,
  userProduct2,
  userProduct3,
  userProduct5,
} from '@testsUT/user-products/user-products-mock-data.model';
import { MealsContainerComponent } from './meals-container.component';

describe('MealsContainerComponent', () => {
  const userProductsMock: UserProduct[] = [
    userProduct1,
    userProduct2,
    userProduct3,
  ];
  const initialState = {
    userProducts: { userProducts: userProductsMock },
  };
  let injector: TestBed;
  let component: MealsContainerComponent;
  let fixture: ComponentFixture<MealsContainerComponent>;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MealsContainerComponent, ProductsListComponent],
      providers: [provideMockStore({ initialState })],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    store = injector.inject(MockStore);
    fixture = TestBed.createComponent(MealsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title', () => {
    const title = 'Some Title';
    component.title = title;

    fixture.detectChanges();

    const displayedTitle = fixture.debugElement.query(By.css('#title'))
      .nativeElement.innerText;

    expect(displayedTitle).toEqual(title);
  });

  it('should display summarized kcal in panel header', () => {
    store.setState({ userProducts: { userProducts: [userProduct5] } });
    component.mealEatTimeType = MealEatTimeType.BREAKFAST;
    component.ngOnInit();
    fixture.detectChanges();

    const kcal = fixture.debugElement.query(By.css('#kcal')).nativeElement
      .innerText;

    expect(kcal).toContain(userProduct5.product.kcal);
  });

  it('should display summarized ingredeints', () => {
    store.setState({ userProducts: { userProducts: [userProduct5] } });
    component.mealEatTimeType = MealEatTimeType.BREAKFAST;
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.product.kcal).toEqual(userProduct5.product.kcal);
    expect(component.product.protein).toEqual(userProduct5.product.protein);
    expect(component.product.carbohydrates).toEqual(
      userProduct5.product.carbohydrates
    );
    expect(component.product.fats).toEqual(userProduct5.product.fats);
  });

  it('should bind display type and user products to list component', () => {
    component.mealEatTimeType = MealEatTimeType.BREAKFAST;
    component.ngOnInit();
    fixture.detectChanges();

    const productsListComponent = fixture.debugElement.query(
      By.directive(ProductsListComponent)
    ).componentInstance as ProductsListComponent;

    expect(productsListComponent.display).toEqual(component.display);
    expect(productsListComponent.userProducts).toEqual([userProduct2]);
  });

  it('should dispatch update disposition', () => {
    spyOn(store, 'dispatch');
    component.mealEatTimeType = MealEatTimeType.BREAKFAST;
    component.ngOnInit();
    fixture.detectChanges();

    const productsListComponent = fixture.debugElement.query(
      By.directive(ProductsListComponent)
    ).componentInstance as ProductsListComponent;

    productsListComponent.triggerDiaryAction({
      action: ButtonAction.UPDATE,
      userProduct: userProduct1,
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      UserProductsAction.UPDATE_USER_PRODUCT_REQUEST({
        userProductModification: {
          product: {
            ...userProduct1,
            productId: userProduct1.id,
          },
        },
      })
    );
  });

  it('should dispatch delete disposition', () => {
    spyOn(store, 'dispatch');
    component.mealEatTimeType = MealEatTimeType.BREAKFAST;
    component.ngOnInit();
    fixture.detectChanges();

    const productsListComponent = fixture.debugElement.query(
      By.directive(ProductsListComponent)
    ).componentInstance as ProductsListComponent;

    productsListComponent.triggerDiaryAction({
      action: ButtonAction.DELETE,
      userProduct: userProduct1,
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      UserProductsAction.DELETE_USER_PRODUCT_REQUEST({
        userProductDeletion: { userProductId: userProduct1.id },
      })
    );
  });

  it('should emit add on add click', () => {
    spyOn(component.action, 'emit').and.callThrough();
    spyOn(component, 'onAddClick').and.callThrough();
    component.mealEatTimeType = MealEatTimeType.BREAKFAST;
    component.ngOnInit();
    fixture.detectChanges();

    const addButton = fixture.debugElement.query(By.css('.add-button'));
    addButton.triggerEventHandler('click', { stopPropagation: () => {} });

    expect(component.onAddClick).toHaveBeenCalled();
    expect(component.action.emit).toHaveBeenCalledWith({
      action: ButtonAction.ADD,
      mealEatTimeType: MealEatTimeType.BREAKFAST,
    });
  });
});
