import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Product, ProductDetailsDisplayType } from '@core/models/products';
import { product1, product2 } from '@testsUT/products/products-mock-data.model';
import { expectComponentProductToEqual } from '@testsUT/products/products-utils.model';
import { ProductDetailsComponent } from './product-details.component';

describe('ProductDetailsComponent', () => {
  const defaultFontSize = 80;
  const defaultDisplayStyle = ProductDetailsDisplayType.COLUMN;
  let injector: TestBed;
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductDetailsComponent],
      imports: [ReactiveFormsModule, FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change font size', () => {
    const changedFontSizeValue = 100;

    expect(component.fontSize).toEqual(defaultFontSize);

    component.fontSize = changedFontSizeValue;

    expect(component.fontSize).toEqual(changedFontSizeValue);
  });

  it('should display style', () => {
    const changeDisplayType = ProductDetailsDisplayType.ROW;

    expect(component.display).toEqual(defaultDisplayStyle);

    component.display = changeDisplayType;

    expect(component.display).toEqual(changeDisplayType);
  });

  it('should display product values', () => {
    component.ngOnInit();

    component.product = product1;

    component.ngOnChanges(null);

    expectComponentProductToEqual(component, product1);
  });

  it('should emit value changes when is in writable mode', () => {
    let product: Product;
    component.readonly = true;
    component.ngOnChanges(null);

    component.value.asObservable().subscribe((p) => (product = p));
    component.product = product1;
    component.ngOnChanges(null);
    component.ngOnInit();

    component.product = product2;
    component.ngOnChanges(null);
    expect(product).toBeFalsy();

    component.readonly = false;
    component.product = product1;
    component.ngOnChanges(null);
    expect(product).toBeTruthy();
  });
});
