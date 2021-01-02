import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  ButtonAction,
  Product,
  ProductAction,
  ProductWrapperDisplayType,
} from '@core/models/products';
import {
  Products,
  ProductsAction,
} from '@core/stores/products/products.actions';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/reducers';

@Component({
  selector: 'app-user-products-list',
  templateUrl: './user-products-list.component.html',
  styleUrls: ['./user-products-list.component.scss'],
})
export class UserProductsListComponent implements OnInit, OnDestroy {
  public products: Product[] = [];
  public display: ProductWrapperDisplayType = ProductWrapperDisplayType.PRODUCT;

  private subscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.subscribeToProducts();
    this.store.dispatch(ProductsAction.GET_ALL_PRODUCTS_REQUEST());
  }

  public ngOnDestroy(): void {}

  public onAction(action: ProductAction): void {
    if (action.action === ButtonAction.UPDATE) {
      this.store.dispatch(
        ProductsAction.UPDATE_PRODUCT_REQUEST({ product: action.product })
      );
    }

    if (action.action === ButtonAction.DELETE) {
      this.store.dispatch(
        ProductsAction.DELETE_PRODUCT_REQUEST({ id: action.product.id })
      );
    }
  }

  private subscribeToProducts(): void {
    const subscription = this.store
      .pipe(select('products'))
      .subscribe((p: Products) => {
        this.products = p.products;
      });
    this.subscription.add(subscription);
  }
}
