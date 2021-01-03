import { Component, OnInit, ViewChild } from '@angular/core';
import { TooltipPosition } from '@angular/material/tooltip';
import { Product } from '@core/models/products';
import { ProductsAction } from '@core/stores/products/products.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { ProductDetailsComponent } from '../product-details/product-details.component';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  @ViewChild('productDetails', { static: true })
  public details: ProductDetailsComponent;

  public readonly toolTipContent =
    'Please, fill the form with valid product informations.';
  public readonly toolTipPosition: TooltipPosition = 'above';
  public readonly toolTipDelay = 200;

  private product: Product;

  constructor(private store: Store<AppState>) {}

  public ngOnInit(): void {}

  public onValue(product: Product): void {
    this.product = product;
  }

  public onSubmit(): void {
    if (this.details.formGroup.invalid) {
      return;
    }
    this.store.dispatch(
      ProductsAction.ADD_PRODUCT_REQUEST({ product: this.product })
    );
    this.details.formGroup.reset();
  }
}
