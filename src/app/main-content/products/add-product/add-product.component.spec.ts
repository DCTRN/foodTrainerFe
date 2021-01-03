import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ProductsAction } from '@core/stores/products/products.actions';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ProductDetailsComponent } from '@testsUT/products/products-mock-components.model';
import { product1 } from '@testsUT/products/products-mock-data.model';
import { AddProductComponent } from './add-product.component';

describe('AddProductComponent', () => {
  let injector: TestBed;
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddProductComponent, ProductDetailsComponent],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    store = injector.inject(MockStore);
    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have button disabled when no informations provided', async () => {
    component.details.formGroup.setErrors({ error: 'error' });
    fixture.detectChanges();
    await fixture.whenStable();

    const addButton = fixture.debugElement.query(By.css('#add-product-btn'));

    expect(addButton).toBeTruthy();
    expect(addButton.nativeElement.disabled).toBeTruthy();
  });

  it('should have button enabled when informations are provided', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const addButton = fixture.debugElement.query(By.css('#add-product-btn'));

    expect(addButton).toBeTruthy();
    expect(addButton.nativeElement.disabled).toBeFalsy();
  });

  it('should add new product when form is valid', async () => {
    spyOn(store, 'dispatch');
    spyOn(component, 'onValue').and.callThrough();
    spyOn(component, 'onSubmit').and.callThrough();
    const details = fixture.debugElement.query(
      By.directive(ProductDetailsComponent)
    ).componentInstance as ProductDetailsComponent;

    details.triggerValueEvent(product1);
    fixture.detectChanges();

    expect(component.onValue).toHaveBeenCalled();

    const addButton = fixture.debugElement.query(By.css('#add-product-btn'));

    addButton.triggerEventHandler('click', {});

    expect(component.onSubmit).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(
      ProductsAction.ADD_PRODUCT_REQUEST({ product: product1 })
    );
  });
});
