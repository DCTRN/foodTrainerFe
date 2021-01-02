import {
  Component,
  EventEmitter,
  Input,
  NO_ERRORS_SCHEMA,
  Output,
} from '@angular/core';
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
import { ProductsAction } from '@core/stores/products/products.actions';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  product1,
  product2,
  product3,
} from '@testsUT/products/products-mock-data.model';
import { UserProductsListComponent } from './user-products-list.component';

@Component({
  selector: 'app-products-list',
  template: '',
})
export class ProductsListComponent {
  @Input()
  public products: Product[] = [];

  @Input()
  public display: ProductWrapperDisplayType = ProductWrapperDisplayType.DIARY;

  @Output()
  public action: EventEmitter<ProductAction> = new EventEmitter<ProductAction>();

  public triggerAction(action: ProductAction): void {
    this.action.emit(action);
  }
}

const productsMock = [product1, product2, product3];
const initialState = {
  products: { products: productsMock },
};

const deleteProductAction = {
  action: ButtonAction.DELETE,
  product: product1,
};

const updateProductAction = {
  action: ButtonAction.UPDATE,
  product: product1,
};
describe('UserProductsListComponent', () => {
  let injector: TestBed;
  let component: UserProductsListComponent;
  let fixture: ComponentFixture<UserProductsListComponent>;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserProductsListComponent, ProductsListComponent],
      providers: [provideMockStore({ initialState })],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    store = injector.inject(MockStore);
    fixture = TestBed.createComponent(UserProductsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch action for user products', () => {
    spyOn(store, 'dispatch');

    component.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(
      ProductsAction.GET_ALL_PRODUCTS_REQUEST()
    );
  });

  it('should bind products and display type to products list', () => {
    component.ngOnInit();

    const productsList = fixture.debugElement.query(
      By.directive(ProductsListComponent)
    ).componentInstance as ProductsListComponent;

    expect(productsList.display).toEqual(ProductWrapperDisplayType.PRODUCT);
    expect(productsList.products.length).toEqual(productsMock.length);
    expect(productsList.products).toEqual(productsMock);
  });

  it('should handle delete action', () => {
    spyOn(store, 'dispatch');
    spyOn(component, 'onAction').and.callThrough();
    component.ngOnInit();

    const productsList = fixture.debugElement.query(
      By.directive(ProductsListComponent)
    ).componentInstance as ProductsListComponent;

    productsList.triggerAction(deleteProductAction);

    expect(component.onAction).toHaveBeenCalledWith(deleteProductAction);
    expect(store.dispatch).toHaveBeenCalledWith(
      ProductsAction.DELETE_PRODUCT_REQUEST({ id: product1.id })
    );
  });

  it('should handle update action', () => {
    spyOn(store, 'dispatch');
    spyOn(component, 'onAction').and.callThrough();
    component.ngOnInit();

    const productsList = fixture.debugElement.query(
      By.directive(ProductsListComponent)
    ).componentInstance as ProductsListComponent;

    productsList.triggerAction(updateProductAction);

    expect(component.onAction).toHaveBeenCalledWith(updateProductAction);
    expect(store.dispatch).toHaveBeenCalledWith(
      ProductsAction.UPDATE_PRODUCT_REQUEST({
        product: updateProductAction.product,
      })
    );
  });
});
