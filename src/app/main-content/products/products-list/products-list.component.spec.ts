import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ButtonAction, ProductAction } from '@core/models/products';
import { ProductWrapperComponent } from '@testsUT/products/products-mock-components.model';
import {
  product1,
  product2,
  product3,
} from '@testsUT/products/products-mock-data.model';
import { ProductsListComponent } from './products-list.component';

describe('ProductsListComponent', () => {
  const productsMock = [product1, product2, product3];
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

    const p1 = fixture.debugElement.queryAll(
      By.directive(ProductWrapperComponent)
    )[0].componentInstance as ProductWrapperComponent;

    p1.triggerActionEvent({
      action: ButtonAction.ADD,
      product: product2,
    });

    expect(action.action).toEqual(ButtonAction.ADD);
    expect(action.product).toEqual(product2);
  });
});
