import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ButtonAction,
  Product,
  ProductAction,
  ProductWrapperDisplayType,
} from '@core/models/products';
import { SearchPanelButtonAction } from '@main-content/products/user-products-list/user-products-list.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ProductsListComponent } from '@testsUT/products/products-mock-components.model';
import { product1, product2 } from '@testsUT/products/products-mock-data.model';
import { Observable, of } from 'rxjs';
import { MealsSearchListComponent } from './meals-search-list.component';
import { MealsSearchListService } from './meals-search-list.service';

class MealsSearchListServiceMock {
  public findProductsBy(searchText: string): Observable<Product[]> {
    return of(null);
  }
}

const productsMock = [product1, product2];
describe('MealsSearchListComponent', () => {
  let injector: TestBed;
  let component: MealsSearchListComponent;
  let fixture: ComponentFixture<MealsSearchListComponent>;
  let mealsSearchListService: MealsSearchListService;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
      declarations: [MealsSearchListComponent, ProductsListComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    TestBed.overrideComponent(MealsSearchListComponent, {
      set: {
        providers: [
          {
            provide: MealsSearchListService,
            useClass: MealsSearchListServiceMock,
          },
        ],
      },
    });
  }));

  beforeEach(() => {
    injector = getTestBed();
    fixture = TestBed.createComponent(MealsSearchListComponent);
    component = fixture.componentInstance;
    mealsSearchListService = fixture.debugElement.injector.get(
      MealsSearchListService
    );
    store = injector.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set products list do diary search', () => {
    const productsList = fixture.debugElement.query(
      By.directive(ProductsListComponent)
    ).componentInstance as ProductsListComponent;

    expect(productsList.display).toEqual(
      ProductWrapperDisplayType.DIARY_SEARCH
    );
  });

  it('should clear products on clear click', () => {
    component.products = productsMock;

    const clearButton = fixture.debugElement.query(By.css('#clear-btn'));
    clearButton.triggerEventHandler('click', {});

    expect(component.products.length).toEqual(0);
  });

  it('should emit back event on back button click', () => {
    spyOn(component.action, 'emit');

    const backButton = fixture.debugElement.query(By.css('#back-btn'));
    backButton.triggerEventHandler('click', {});

    expect(component.action.emit).toHaveBeenCalled();
  });

  it('should search products on search click', () => {
    const searchText = 'apple';
    spyOn(mealsSearchListService, 'findProductsBy').and.returnValue(
      of(productsMock)
    );
    spyOn(component, 'buttonActionClick').and.callThrough();

    component.search.setValue(searchText);
    const searchButton = fixture.debugElement.query(By.css('#search-btn'));
    searchButton.triggerEventHandler('click', {});
    fixture.detectChanges();
    const productsList = fixture.debugElement.query(
      By.directive(ProductsListComponent)
    ).componentInstance as ProductsListComponent;

    expect(component.buttonActionClick).toHaveBeenCalledWith(
      SearchPanelButtonAction.SEARCH
    );
    expect(mealsSearchListService.findProductsBy).toHaveBeenCalledWith(
      searchText
    );
    expect(component.products).toEqual(productsMock);
    expect(productsList.products).toEqual(productsMock);
  });

  it('should emit add action on add product action', () => {
    const addProductAction: ProductAction = {
      action: ButtonAction.ADD,
      product: product1,
    };
    spyOn(store, 'dispatch');
    spyOn(component, 'onAction').and.callThrough();

    const productsList = fixture.debugElement.query(
      By.directive(ProductsListComponent)
    ).componentInstance as ProductsListComponent;

    productsList.triggerProductAction(addProductAction);

    expect(component.onAction).toHaveBeenCalledWith(addProductAction);
    expect(store.dispatch).toHaveBeenCalled();
  });
});
