import { SimpleChange, SimpleChanges } from '@angular/core';
import { Product } from '@core/models/products';
import { ProductDetailsComponent } from '@main-content/products/product-details/product-details.component';

export function expectComponentProductToEqual(
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

export function createSimpleChange(previous: any, current: any): SimpleChange {
  return new SimpleChange(previous, current, false);
}

export function createSimpleChangesForProduct(
  previous: any,
  current: any
): SimpleChanges {
  return {
    product: createSimpleChange(previous, current),
  };
}
