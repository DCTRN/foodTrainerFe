import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  Product,
  ProductAction,
  ProductExpandStatus,
  ProductWrapperDisplayType,
} from '@core/models/products';
import { DiaryAction } from '@core/models/products/diary-action.interface';
import { UserProductExpandStatus } from '@core/models/products/user-product-expaned-status.interface';
import { UserProduct } from '@core/models/user-products';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit, OnChanges {
  @Input()
  public display: ProductWrapperDisplayType =
    ProductWrapperDisplayType.DIARY_SEARCH;

  @Input()
  public products: Product[] = [];

  @Input()
  public userProducts: UserProduct[] = [];

  @Output()
  public productAction: EventEmitter<ProductAction> = new EventEmitter<ProductAction>();

  @Output()
  public diaryAction: EventEmitter<DiaryAction> = new EventEmitter<DiaryAction>();

  public productsExpandedStatus: ProductExpandStatus[] = [];
  public userProductsExpandedStatus: UserProductExpandStatus[] = [];

  public readonly emptyProductListText = 'No products to display.';
  public readonly displayType = ProductWrapperDisplayType;

  constructor() {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.display !== ProductWrapperDisplayType.DIARY_SUMMARY) {
      const currentProducts = this.extractCurrentProducts(changes);
      this.productChangesHandler(currentProducts);
    } else {
      const currentUserProducts = this.extractCurrentUserProducts(changes);
      this.userProductChangesHandler(currentUserProducts);
    }
  }

  public ngOnInit(): void {
    this.productChangesHandler(this.products);
    this.userProductChangesHandler(this.userProducts);
  }

  public onProductAction(action: ProductAction): void {
    this.productAction.emit(action);
  }

  public onDiaryAction(action: DiaryAction): void {
    this.diaryAction.emit(action);
  }

  public onToggle(product: ProductExpandStatus): void {
    const index = this.getProductExpanStatusIndex(product);
    this.updateProductExpandStatusBy(index);
  }

  public onDiaryToggle(userProduct: UserProductExpandStatus): void {
    const index = this.getUserProductExpanStatusIndex(userProduct);
    this.updateUserProductExpandStatusBy(index);
  }

  public shouldDisplayEmptyListText(): boolean {
    return (
      this.shouldDisplayEmptyListForProducts() ||
      this.shouldDisplayEmptyListForDiary()
    );
  }

  private shouldDisplayEmptyListForDiary(): boolean {
    return (
      !this.userProducts?.length && this.display !== this.displayType.PRODUCT
    );
  }

  private shouldDisplayEmptyListForProducts(): boolean {
    return !this.products?.length && this.display === this.displayType.PRODUCT;
  }

  private extractCurrentProducts(changes: SimpleChanges): Product[] {
    return changes?.products?.currentValue as Product[];
  }

  private getProductExpanStatusIndex(product: ProductExpandStatus): number {
    return this.productsExpandedStatus.findIndex(
      (p) => p.product.id === product.product.id
    );
  }

  private updateProductExpandStatusBy(index: number): number {
    if (index === -1) {
      return;
    }
    this.productsExpandedStatus[index].expanded = !this.productsExpandedStatus[
      index
    ].expanded;
  }

  private productChangesHandler(currentProducts: Product[]): void {
    this.productsExpandedStatus = currentProducts?.map((product, i) =>
      this.updateProductsExpandStatus(product)
    );
  }

  private updateProductsExpandStatus(product: Product): ProductExpandStatus {
    const cachedStatus = this.getCachedExpandStatusByProductId(product?.id);
    return this.createProductExpandStatus(product, !!cachedStatus?.expanded);
  }

  private getCachedExpandStatusByProductId(id: number): ProductExpandStatus {
    return this.productsExpandedStatus?.find((p) => p.product.id === id);
  }

  private createProductExpandStatus(
    product: Product,
    expanded: boolean
  ): ProductExpandStatus {
    return {
      product,
      expanded,
    };
  }

  // USER PRODUCT
  private extractCurrentUserProducts(changes: SimpleChanges): UserProduct[] {
    return changes?.userProducts?.currentValue as UserProduct[];
  }

  private getUserProductExpanStatusIndex(
    userProduct: UserProductExpandStatus
  ): number {
    return this.userProductsExpandedStatus.findIndex(
      (p) => p.userProduct.id === userProduct.userProduct.id
    );
  }

  private updateUserProductExpandStatusBy(index: number): number {
    if (index === -1) {
      return;
    }
    this.userProductsExpandedStatus[index].expanded = !this
      .userProductsExpandedStatus[index].expanded;
  }

  private userProductChangesHandler(currentUserProducts: UserProduct[]): void {
    this.userProductsExpandedStatus = currentUserProducts?.map(
      (userProduct, i) => this.updateUserProductsExpandStatus(userProduct)
    );
  }

  private updateUserProductsExpandStatus(
    product: UserProduct
  ): UserProductExpandStatus {
    const cachedStatus = this.getCachedExpandStatusByUserProductId(product?.id);
    return this.createUserProductExpandStatus(
      product,
      !!cachedStatus?.expanded
    );
  }

  private getCachedExpandStatusByUserProductId(
    id: number
  ): UserProductExpandStatus {
    return this.userProductsExpandedStatus?.find(
      (p) => p.userProduct.id === id
    );
  }

  private createUserProductExpandStatus(
    userProduct: UserProduct,
    expanded: boolean
  ): UserProductExpandStatus {
    return {
      userProduct,
      expanded,
    };
  }
}
