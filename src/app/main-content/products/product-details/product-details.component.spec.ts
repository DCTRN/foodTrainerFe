import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Product } from '@core/models/products';
import { product1, product2 } from '@testsUT/products/products-mock-data.model';
import {
  DisplayType,
  ProductDetailsComponent,
} from './product-details.component';

describe('ProductDetailsComponent', () => {
  const defaultFontSize = 80;
  const defaultDisplayStyle = DisplayType.COLUMN;
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
    const changeDisplayType = DisplayType.ROW;

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

function expectComponentProductToEqual(
  component: ProductDetailsComponent,
  product: Product
): void {
  const producer = component.producer.value;
  const name = component.name.value;
  const unit = component.unit.value;
  const amount = component.amount.value;
  const kcal = component.kcal.value;
  const protein = component.protein.value;
  const carbohydrates = component.carbohydrates.value;
  const fats = component.fats.value;

  expect(producer).toEqual(product.producer);
  expect(name).toEqual(product.name);
  expect(unit).toEqual(product.unit);
  expect(amount).toEqual(product.amount);
  expect(kcal).toEqual(product.kcal);
  expect(protein).toEqual(product.protein);
  expect(carbohydrates).toEqual(product.carbohydrates);
  expect(fats).toEqual(product.fats);
}
