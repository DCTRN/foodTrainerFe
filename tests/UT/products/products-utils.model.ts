import { SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Product, ProductExpandStatus } from '@core/models/products';
import { ProductDetailsComponent } from '@main-content/products/product-details/product-details.component';
import { ProductsListComponent } from '@main-content/products/products-list/products-list.component';
import { ProductWrapperComponent } from './products-mock-components.model';

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

export function initializeListComponent(
  component: ProductsListComponent,
  productsMock: Product[]
): void {
  component.products = productsMock;
  const productsSimpleChange = new SimpleChange([], productsMock, true);
  component.ngOnChanges({ products: productsSimpleChange });
  component.ngOnInit();
}

export function findProductExpandStatusBy(
  id: number,
  component: ProductsListComponent
): ProductExpandStatus {
  return component.productsExpandedStatus.find(
    (status) => status.product.id === id
  );
}

export function getProductWrapper(
  fixture: ComponentFixture<ProductsListComponent>,
  productIndex: number = 0
): ProductWrapperComponent {
  return fixture.debugElement.queryAll(By.directive(ProductWrapperComponent))[
    productIndex
  ].componentInstance as ProductWrapperComponent;
}
