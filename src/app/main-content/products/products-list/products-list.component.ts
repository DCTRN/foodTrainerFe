import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '@core/models/products';
import {
  ProductAction,
  ProductWrapperDisplayType,
} from '../product-wrapper/product-wrapper.component';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit {
  @Input()
  public products: Product[] = [];

  @Input()
  public display: ProductWrapperDisplayType = ProductWrapperDisplayType.DIARY;

  @Output()
  public action: EventEmitter<ProductAction> = new EventEmitter<ProductAction>();

  public emptyProductListText = 'No products to display.';

  constructor() {}

  public ngOnInit(): void {}

  public onAction(action: ProductAction): void {
    this.action.emit(action);
  }
}
