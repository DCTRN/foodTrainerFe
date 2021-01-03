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

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit, OnChanges {
  @Input()
  public products: Product[] = [];

  @Input()
  public display: ProductWrapperDisplayType = ProductWrapperDisplayType.DIARY;

  @Output()
  public action: EventEmitter<ProductAction> = new EventEmitter<ProductAction>();

  public productsExpandedStatus: ProductExpandStatus[] = [];
  public readonly emptyProductListText = 'No products to display.';

  constructor() {}

  public ngOnChanges(changes: SimpleChanges): void {
    const currentProducts = this.extractCurrentProducts(changes);
    this.productChangesHandler(currentProducts);
  }

  public ngOnInit(): void {}

  public onAction(action: ProductAction): void {
    this.action.emit(action);
  }

  public onToggle(product: ProductExpandStatus): void {
    const index = this.getProductExpanStatusIndex(product);
    this.updateProductExpandStatusBy(index);
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

  private getCachedExpandStatusByProductId(id: number) {
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
}
