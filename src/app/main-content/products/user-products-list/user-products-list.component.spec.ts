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
import { ModalService } from '@core/modal-service/modal.service';
import { ModalConfiguration } from '@core/modal-service/models/modal-configuration';
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
import { ModalServiceMock } from '@testsUT/shared/shared-mock-services.model';
import { UserProductsListComponent } from './user-products-list.component';

@Component({
  selector: 'app-products-list',
  template: '',
})
export class ProductsListComponent {
  @Input()
  public products: Product[] = [];

  @Input()
  public display: ProductWrapperDisplayType = ProductWrapperDisplayType.DIARY_SEARCH;

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
  let modalService: ModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserProductsListComponent, ProductsListComponent],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: ModalService,
          useClass: ModalServiceMock,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    store = injector.inject(MockStore);
    modalService = injector.inject(ModalService);
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

  it('should show all user products on: show all button click', () => {
    component.ngOnInit();

    const showAllButton = fixture.debugElement.query(By.css('#show-all-btn'));
    expect(showAllButton).toBeTruthy();

    showAllButton.triggerEventHandler('click', {});
    fixture.detectChanges();

    const productsList = fixture.debugElement.query(
      By.directive(ProductsListComponent)
    ).componentInstance as ProductsListComponent;

    expect(productsList.display).toEqual(ProductWrapperDisplayType.PRODUCT);
    expect(productsList.products.length).toEqual(productsMock.length);
    expect(productsList.products).toEqual(productsMock);
  });

  it('should search user products by search text', () => {
    component.ngOnInit();

    component.search.setValue('kiwi');
    const searchButton = fixture.debugElement.query(By.css('#search-btn'));
    expect(searchButton).toBeTruthy();

    searchButton.triggerEventHandler('click', {});
    fixture.detectChanges();

    const productsList = fixture.debugElement.query(
      By.directive(ProductsListComponent)
    ).componentInstance as ProductsListComponent;

    expect(productsList.display).toEqual(ProductWrapperDisplayType.PRODUCT);
    expect(productsList.products.length).toEqual(1);
  });

  it('should clear list and search text', () => {
    component.ngOnInit();

    component.search.setValue('kiwi');
    const searchButton = fixture.debugElement.query(By.css('#search-btn'));
    searchButton.triggerEventHandler('click', {});
    fixture.detectChanges();

    const clearButton = fixture.debugElement.query(By.css('#clear-btn'));
    clearButton.triggerEventHandler('click', {});
    fixture.detectChanges();

    const productsList = fixture.debugElement.query(
      By.directive(ProductsListComponent)
    ).componentInstance as ProductsListComponent;

    expect(productsList.display).toEqual(ProductWrapperDisplayType.PRODUCT);
    expect(productsList.products.length).toEqual(0);
    expect(component.search.value).toBeFalsy();
  });

  it('should handle delete action', () => {
    let modal: ModalConfiguration;
    spyOn(modalService, 'openDialog').and.callFake((m) => (modal = m));
    spyOn(modalService, 'closeDialog');
    spyOn(store, 'dispatch');
    spyOn(component, 'onAction').and.callThrough();
    component.ngOnInit();

    const productsList = fixture.debugElement.query(
      By.directive(ProductsListComponent)
    ).componentInstance as ProductsListComponent;

    productsList.triggerAction(deleteProductAction);

    expect(modalService.openDialog).toHaveBeenCalled();

    modal.getFooter().getButtons()[1].getCallback()();

    expect(component.onAction).toHaveBeenCalledWith(deleteProductAction);
    expect(store.dispatch).toHaveBeenCalledWith(
      ProductsAction.DELETE_PRODUCT_REQUEST({ id: product1.id })
    );
    expect(modalService.closeDialog).toHaveBeenCalled();
  });

  it('should handle update action', () => {
    let modal: ModalConfiguration;
    spyOn(modalService, 'openDialog').and.callFake((m) => (modal = m));
    spyOn(modalService, 'closeDialog');
    spyOn(store, 'dispatch');
    spyOn(component, 'onAction').and.callThrough();
    component.ngOnInit();

    const productsList = fixture.debugElement.query(
      By.directive(ProductsListComponent)
    ).componentInstance as ProductsListComponent;

    productsList.triggerAction(updateProductAction);

    expect(modalService.openDialog).toHaveBeenCalled();

    modal.getFooter().getButtons()[1].getCallback()();

    expect(modalService.closeDialog).toHaveBeenCalled();
    expect(component.onAction).toHaveBeenCalledWith(updateProductAction);
    expect(store.dispatch).toHaveBeenCalledWith(
      ProductsAction.UPDATE_PRODUCT_REQUEST({
        product: updateProductAction.product,
      })
    );
  });

  it('should update list on action ', async () => {
    const productsMockModified = [product3, product2];
    const productsModifiedState = {
      products: { products: productsMockModified },
    };
    let modal: ModalConfiguration;
    spyOn(modalService, 'openDialog').and.callFake((m) => (modal = m));
    spyOn(modalService, 'closeDialog');
    component.ngOnInit();

    const showAllButton = fixture.debugElement.query(By.css('#show-all-btn'));
    showAllButton.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(component.innerProducts).toEqual(productsMock);

    const productsList = fixture.debugElement.query(
      By.directive(ProductsListComponent)
    ).componentInstance as ProductsListComponent;

    productsList.triggerAction(deleteProductAction);

    modal.getFooter().getButtons()[1].getCallback()();

    store.setState(productsModifiedState);
    fixture.detectChanges();

    expect(component.innerProducts).toEqual([product3, product2]);
  });
});
