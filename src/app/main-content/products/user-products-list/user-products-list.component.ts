import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ModalService } from '@core/modal-service/modal.service';
import { DeleteProductModalConfiguration } from '@core/modals-configurations/delete-product.model';
import { UpdateProductModalConfiguration } from '@core/modals-configurations/update-product.model';
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
import { trim } from '@core/util-functions/util-functions';
import { select, Store } from '@ngrx/store';
import { SimpleErrorStateMatcher } from '@utils/simple-error-state-matcher.class';
import { cloneDeep } from 'lodash';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/reducers';

enum SearchPanelButtonAction {
  SEARCH,
  CLEAR,
  SHOW_ALL,
}
@Component({
  selector: 'app-user-products-list',
  templateUrl: './user-products-list.component.html',
  styleUrls: ['./user-products-list.component.scss'],
})
export class UserProductsListComponent implements OnInit, OnDestroy {
  public products: Product[] = [];
  public innerProducts: Product[] = [];
  public display: ProductWrapperDisplayType = ProductWrapperDisplayType.PRODUCT;
  public buttonAction = SearchPanelButtonAction;

  public simpleErrorStateMatcher = new SimpleErrorStateMatcher();
  public search = new FormControl('', [Validators.minLength(1)]);

  private subscription = new Subscription();

  private updateConfig = new UpdateProductModalConfiguration(this.modalService);
  private deleteConfig = new DeleteProductModalConfiguration(this.modalService);

  private actionHandlers = {
    [ButtonAction.UPDATE]: (action: ProductAction) => {
      this.updateActionHandler(action);
    },
    [ButtonAction.DELETE]: (action: ProductAction) => {
      this.deleteActionHandler(action);
    },
  };

  private buttonActionHandlers = {
    [SearchPanelButtonAction.SEARCH]: () => {
      this.innerProducts = cloneDeep(this.filterProductsByCurrentSerachText());
    },
    [SearchPanelButtonAction.SHOW_ALL]: () => {
      this.innerProducts = cloneDeep(this.products);
    },
    [SearchPanelButtonAction.CLEAR]: () => {
      this.innerProducts = [];
      this.search.reset();
    },
  };

  constructor(
    private store: Store<AppState>,
    private modalService: ModalService
  ) {}

  public ngOnInit(): void {
    this.subscribeToProducts();
    this.store.dispatch(ProductsAction.GET_ALL_PRODUCTS_REQUEST());
  }

  public ngOnDestroy(): void {}

  public onAction(action: ProductAction): void {
    this.actionHandlers[action.action](action);
  }

  public buttonActionClick(action: SearchPanelButtonAction): void {
    this.buttonActionHandlers[action]();
  }

  private filterProductsByCurrentSerachText(): Product[] {
    const searchText = trim(this.search.value).toLocaleUpperCase();
    return this.products.filter(
      (p: Product) =>
        p.producer.toLocaleUpperCase().includes(searchText) ||
        p.name.toLocaleUpperCase().includes(searchText)
    );
  }

  private deleteActionHandler(action: ProductAction) {
    this.deleteConfig.deleteProductButton.setCallback(() =>
      this.deleteProductButtonCallback(action)
    );
    this.modalService.openDialog(this.deleteConfig);
  }

  private deleteProductButtonCallback(action: ProductAction) {
    this.dispatchDeleteAction(action);
    this.closeModal(this.deleteConfig.getId());
  }

  private dispatchDeleteAction(action: ProductAction): void {
    this.store.dispatch(
      ProductsAction.DELETE_PRODUCT_REQUEST({ id: action.product.id })
    );
  }

  private updateActionHandler(action: ProductAction): void {
    this.updateConfig.updateProductButton.setCallback(() =>
      this.updateProductButtonCallback(action)
    );
    this.modalService.openDialog(this.updateConfig);
  }

  private updateProductButtonCallback(action: ProductAction): void {
    this.dispatchUpdateProductAction(action);
    this.closeModal(this.updateConfig.getId());
  }

  private dispatchUpdateProductAction(action: ProductAction): void {
    this.store.dispatch(
      ProductsAction.UPDATE_PRODUCT_REQUEST({ product: action.product })
    );
  }

  private subscribeToProducts(): void {
    const subscription = this.store
      .pipe(select('products'))
      .subscribe((p: Products) => this.updateProductsHandler(p));
    this.subscription.add(subscription);
  }

  private updateProductsHandler(p: Products): void {
    this.products = p.products;
    this.updateListIfExpanded();
  }

  private updateListIfExpanded(): void {
    if (!this.innerProducts.length) {
      return;
    }
    this.innerProducts = cloneDeep(this.products);
  }

  private closeModal(id: string): void {
    this.modalService.closeDialog(id);
  }
}
