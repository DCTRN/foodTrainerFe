import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  Product,
  ProductAction,
  ProductDetailsDisplayType,
  ProductWrapperDisplayType,
} from '@core/models/products';

@Component({
  selector: 'app-product-details',
  template: '',
})
export class ProductDetailsComponent {
  @Input()
  public fontSize: number = 60;
  @Input()
  public display: ProductDetailsDisplayType = ProductDetailsDisplayType.COLUMN;
  @Input()
  public readonly = true;
  @Input()
  public product: Product;

  @Output()
  public value: EventEmitter<Product> = new EventEmitter<Product>();

  public triggerValueEvent(product: Product): void {
    this.value.emit(product);
  }
}

@Component({
  selector: 'app-product-wrapper',
  template: '',
})
export class ProductWrapperComponent {
  @Input()
  public product: Product;

  @Input()
  public display: ProductWrapperDisplayType = ProductWrapperDisplayType.DIARY;

  @Output()
  public action: EventEmitter<ProductAction> = new EventEmitter<ProductAction>();

  public triggerActionEvent(action: ProductAction): void {
    this.action.emit(action);
  }
}
