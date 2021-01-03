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
  ProductAction,
  ProductExpandStatus,
} from '@core/models/products';
import { ProductWrapperComponent } from '@testsUT/products/products-mock-components.model';
import {
  product1,
  product2,
  product3,
  product4,
} from '@testsUT/products/products-mock-data.model';
import {
  initializeListComponent,
  findProductExpandStatusBy,
  getProductWrapper,
} from '@testsUT/products/products-utils.model';
import { ProductsListComponent } from './products-list.component';

describe('ProductsListComponent', () => {
  const productsMock = [product1, product2, product3];
  const productsMockChanged = [product1, product2, product3, product4];
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

    const emptyText = fixture.debugElement.query(By.css('#empty-list__text'))
      .nativeElement.innerText;

    expect(emptyText).toEqual(component.emptyProductListText);
  });

  it('should not display text for empty list, when products are provided', () => {
    component.products = productsMock;
    fixture.detectChanges();

    const emptyText = fixture.debugElement.query(By.css('#empty-list__text'))
      ?.nativeElement?.innerText;

    expect(emptyText).toBeFalsy();
  });

  it('should display products list when products are provided', () => {
    component.products = productsMock;
    fixture.detectChanges();

    const products = fixture.debugElement.queryAll(
      By.directive(ProductWrapperComponent)
    );

    expect(products.length).toEqual(productsMock.length);
  });

  it('should emit action event to parent component', () => {
    let action: ProductAction;
    spyOn(component.action, 'emit').and.callFake(
      (a: ProductAction) => (action = a)
    );
    component.products = productsMock;
    fixture.detectChanges();

    const productWrapper = getProductWrapper(fixture);

    productWrapper.triggerActionEvent({
      action: ButtonAction.ADD,
      product: product2,
    });

    expect(action.action).toEqual(ButtonAction.ADD);
    expect(action.product).toEqual(product2);
  });

  it('should have all products panels hidden on initial', () => {
    initializeListComponent(component, productsMock);
    fixture.detectChanges();

    const expandStatus = component.productsExpandedStatus;
    expandStatus.forEach((status: ProductExpandStatus) =>
      expect(status.expanded).toBeFalsy()
    );
  });

  it('should handle toggle event', () => {
    spyOn(component, 'onToggle').and.callThrough();
    initializeListComponent(component, productsMock);
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

  it('should use cached expand status', () => {
    let status: ProductExpandStatus;
    spyOn(component, 'onToggle').and.callThrough();
    initializeListComponent(component, productsMock);
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
});
