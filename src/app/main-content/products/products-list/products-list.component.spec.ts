import { SimpleChange } from '@angular/core';
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
  ProductExpandStatus,
  ProductWrapperDisplayType,
} from '@core/models/products';
import { DiaryAction } from '@core/models/products/diary-action.interface';
import { UserProductExpandStatus } from '@core/models/products/user-product-expaned-status.interface';
import { UserProduct } from '@core/models/user-products';
import { ProductWrapperComponent } from '@testsUT/products/products-mock-components.model';
import {
  product1,
  product2,
  product3,
  product4,
} from '@testsUT/products/products-mock-data.model';
import {
  findProductExpandStatusBy,
  findUserProductExpandStatusBy,
  getProductWrapper,
  initializeListComponent,
} from '@testsUT/products/products-utils.model';
import {
  userProduct1,
  userProduct2,
  userProduct3,
  userProduct4,
} from '@testsUT/user-products/user-products-mock-data.model';
import { ProductsListComponent } from './products-list.component';

describe('ProductsListComponent', () => {
  const productsMock: Product[] = [product1, product2, product3];
  const productsMockChanged: Product[] = [
    product1,
    product2,
    product3,
    product4,
  ];
  const userProductsMock: UserProduct[] = [
    userProduct1,
    userProduct2,
    userProduct3,
  ];
  const userProductsMockChanged: UserProduct[] = [
    userProduct1,
    userProduct2,
    userProduct3,
    userProduct4,
  ];
  let injector: TestBed;
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductsListComponent, ProductWrapperComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display text for empty list when there is no products to display', () => {
    component.products = [];
    component.display = ProductWrapperDisplayType.PRODUCT;

    const emptyText = fixture.debugElement.query(By.css('#empty-list__text'))
      .nativeElement.innerText;

    expect(emptyText).toEqual(component.emptyProductListText);
  });

  it('should not display text for empty list, when products are provided', () => {
    component.products = productsMock;
    component.display = ProductWrapperDisplayType.PRODUCT;
    fixture.detectChanges();

    const emptyText = fixture.debugElement.query(By.css('#empty-list__text'))
      ?.nativeElement?.innerText;

    expect(emptyText).toBeFalsy();
  });

  it('should display products list when products are provided', () => {
    component.display = ProductWrapperDisplayType.PRODUCT;
    component.products = productsMock;
    fixture.detectChanges();

    const products = fixture.debugElement.queryAll(
      By.directive(ProductWrapperComponent)
    );

    expect(products.length).toEqual(productsMock.length);
  });

  it('should emit action event to parent component', () => {
    let action: ProductAction;
    spyOn(component.productAction, 'emit').and.callFake(
      (a: ProductAction) => (action = a)
    );
    component.products = productsMock;
    component.display = ProductWrapperDisplayType.PRODUCT;
    fixture.detectChanges();

    const productWrapper = getProductWrapper(fixture);

    productWrapper.triggerProductActionEvent({
      action: ButtonAction.ADD,
      product: product2,
    });

    expect(action.action).toEqual(ButtonAction.ADD);
    expect(action.product).toEqual(product2);
  });

  it('should have all products panels hidden on initial', () => {
    initializeListComponent(component, productsMock);
    component.display = ProductWrapperDisplayType.PRODUCT;
    fixture.detectChanges();

    const expandStatus = component.productsExpandedStatus;
    expandStatus.forEach((status: ProductExpandStatus) =>
      expect(status.expanded).toBeFalsy()
    );
  });

  it('should handle toggle event', () => {
    spyOn(component, 'onToggle').and.callThrough();
    initializeListComponent(component, productsMock);
    component.display = ProductWrapperDisplayType.PRODUCT;
    fixture.detectChanges();

    const productWrapper = getProductWrapper(fixture);
    const toggle1 = {
      product: product1,
      expanded: true,
    };
    productWrapper.triggerToggleEvent(toggle1);

    expect(component.onToggle).toHaveBeenCalledWith(toggle1);

    const status = component.productsExpandedStatus.find(
      (status) => status.product.id === product1.id
    );
    expect(status.expanded).toEqual(true);
  });

  it('should use cached expand status for products', () => {
    let status: ProductExpandStatus;
    spyOn(component, 'onToggle').and.callThrough();
    initializeListComponent(component, productsMock);
    component.display = ProductWrapperDisplayType.PRODUCT;
    fixture.detectChanges();

    const productWrapper = getProductWrapper(fixture);
    const toggle1 = {
      product: product1,
      expanded: true,
    };
    productWrapper.triggerToggleEvent(toggle1);

    expect(component.onToggle).toHaveBeenCalledWith(toggle1);

    status = component.productsExpandedStatus.find(
      (status) => status.product.id === product1.id
    );
    expect(status.expanded).toEqual(true);

    const simpleChange = new SimpleChange(
      productsMock,
      productsMockChanged,
      false
    );

    component.ngOnChanges({ products: simpleChange });
    fixture.detectChanges();

    status = findProductExpandStatusBy(product1.id, component);
    expect(status.expanded).toEqual(true);
  });

  // user products

  it('should display text for empty list when there is no user products to display', () => {
    component.userProducts = [];
    component.display = ProductWrapperDisplayType.DIARY_SEARCH;

    const emptyText = fixture.debugElement.query(By.css('#empty-list__text'))
      .nativeElement.innerText;

    expect(emptyText).toEqual(component.emptyProductListText);
  });

  it('should not display text for empty list, when user products are provided', () => {
    component.userProducts = userProductsMock;
    component.display = ProductWrapperDisplayType.DIARY_SEARCH;
    fixture.detectChanges();

    const emptyText = fixture.debugElement.query(By.css('#empty-list__text'))
      ?.nativeElement?.innerText;

    expect(emptyText).toBeFalsy();
  });

  it('should display products list when user products are provided', () => {
    component.display = ProductWrapperDisplayType.DIARY_SUMMARY;
    component.userProducts = userProductsMock;
    fixture.detectChanges();

    const products = fixture.debugElement.queryAll(
      By.directive(ProductWrapperComponent)
    );

    expect(products.length).toEqual(productsMock.length);
  });

  it('should emit diary action event to parent component', () => {
    let action: DiaryAction;
    spyOn(component.diaryAction, 'emit').and.callFake(
      (a: DiaryAction) => (action = a)
    );
    component.display = ProductWrapperDisplayType.DIARY_SUMMARY;
    component.userProducts = userProductsMock;
    fixture.detectChanges();

    const productWrapper = getProductWrapper(fixture);

    productWrapper.triggerDiaryActionEvent({
      action: ButtonAction.ADD,
      userProduct: userProduct2,
    });

    expect(action.action).toEqual(ButtonAction.ADD);
    expect(action.userProduct).toEqual(userProduct2);
  });

  it('should have all products panels hidden on initial', () => {
    component.display = ProductWrapperDisplayType.DIARY_SEARCH;
    component.userProducts = userProductsMock;
    fixture.detectChanges();

    const expandStatus = component.userProductsExpandedStatus;
    expandStatus.forEach((status: UserProductExpandStatus) =>
      expect(status.expanded).toBeFalsy()
    );
    expect(true).toBeTrue();
  });

  it('should handle toggle event', () => {
    spyOn(component, 'onDiaryToggle').and.callThrough();
    component.display = ProductWrapperDisplayType.DIARY_SUMMARY;
    component.userProducts = userProductsMock;
    component.ngOnInit();
    fixture.detectChanges();

    const productWrapper = getProductWrapper(fixture);
    const toggle1: UserProductExpandStatus = {
      userProduct: userProduct1,
      expanded: true,
    };
    productWrapper.triggerDiaryToggleEvent(toggle1);

    expect(component.onDiaryToggle).toHaveBeenCalledWith(toggle1);

    const status = component.userProductsExpandedStatus.find(
      (status) => status.userProduct.id === userProduct1.id
    );
    expect(status.expanded).toEqual(true);
  });

  it('should use cached expand status for user products', () => {
    let status: UserProductExpandStatus;
    spyOn(component, 'onDiaryToggle').and.callThrough();
    component.display = ProductWrapperDisplayType.DIARY_SUMMARY;
    component.userProducts = userProductsMock;
    component.ngOnInit();
    fixture.detectChanges();

    const productWrapper = getProductWrapper(fixture);
    const toggle1: UserProductExpandStatus = {
      userProduct: userProduct1,
      expanded: true,
    };
    productWrapper.triggerDiaryToggleEvent(toggle1);

    expect(component.onDiaryToggle).toHaveBeenCalledWith(toggle1);

    status = component.userProductsExpandedStatus.find(
      (status) => status.userProduct.id === userProduct1.id
    );
    expect(status.expanded).toEqual(true);

    const simpleChange = new SimpleChange(
      userProductsMock,
      userProductsMockChanged,
      false
    );

    component.ngOnChanges({ userProducts: simpleChange });
    fixture.detectChanges();

    status = findUserProductExpandStatusBy(userProduct1.id, component);
    expect(status.expanded).toEqual(true);
  });
});
