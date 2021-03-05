import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  ButtonAction,
  Product,
  ProductAction,
  ProductDetailsDisplayType,
  ProductExpandStatus,
  ProductWrapperDisplayType,
} from '@core/models/products';
import { DiaryAction } from '@core/models/products/diary-action.interface';
import { UserProductExpandStatus } from '@core/models/products/user-product-expaned-status.interface';
import { UserProduct } from '@core/models/user-products';
import { calculateProductValues } from '@core/util-functions/util-functions';
import { cloneDeep, isEqual } from 'lodash';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-product-wrapper',
  templateUrl: './product-wrapper.component.html',
  styleUrls: ['./product-wrapper.component.scss'],
})
export class ProductWrapperComponent implements OnInit, OnDestroy {
  @Input()
  public product: Product;

  @Input()
  public userProduct: UserProduct;

  @Input()
  public expanded: boolean = false;

  @Input()
  public display: ProductWrapperDisplayType =
    ProductWrapperDisplayType.DIARY_SEARCH;

  @Output()
  public productAction: EventEmitter<ProductAction> = new EventEmitter<ProductAction>();

  @Output()
  public diaryAction: EventEmitter<DiaryAction> = new EventEmitter<DiaryAction>();

  @Output()
  public toggle: EventEmitter<ProductExpandStatus> = new EventEmitter<ProductExpandStatus>();

  @Output()
  public diaryToggle: EventEmitter<UserProductExpandStatus> = new EventEmitter<UserProductExpandStatus>();

  public detailsDisplay: ProductDetailsDisplayType =
    ProductDetailsDisplayType.COLUMN;
  public innerProduct: Product;
  public detailsProduct: Product;
  public productWrapperDisplayType = ProductWrapperDisplayType;
  public buttonAction = ButtonAction;
  public amount = new FormControl('', [
    Validators.required,
    Validators.minLength(1),
    Validators.min(1),
  ]);
  public updateDisabled = true;

  private subscriptions = new Subscription();

  private readonly productDetailsDisplayChangeThreshold = 1366;

  constructor(private changeDectorRef: ChangeDetectorRef) {}

  @HostListener('window:resize', ['$event'])
  public onResize(event): void {
    this.updateDetailsDisplayType(event.target.innerWidth);
  }

  public ngOnInit(): void {
    if (!this.product) {
      this.product = this.userProduct?.product;
    }
    this.innerProduct = cloneDeep(this.product);
    this.detailsProduct = cloneDeep(this.product);
    this.updateDetailsDisplayType(window.innerWidth);
    this.subscribeToAmountChanges();
    this.setInitialAmount();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onClick(buttonAction: ButtonAction): void {
    if (this.display !== ProductWrapperDisplayType.DIARY_SUMMARY) {
      this.productAction.emit({
        action: buttonAction,
        product: cloneDeep(this.innerProduct),
      });
    } else {
      this.diaryAction.emit({
        action: buttonAction,
        userProduct: { ...this.userProduct, amount: this.amount.value },
      });
    }
  }

  public onToggle(): void {
    this.expanded = !this.expanded;
    if (this.display === ProductWrapperDisplayType.PRODUCT) {
      this.toggle.emit({
        product: cloneDeep(this.innerProduct),
        expanded: this.expanded,
      });
    } else {
      this.diaryToggle.emit({
        userProduct: cloneDeep(this.userProduct),
        expanded: this.expanded,
      });
    }
  }

  public onValue(product: Product): void {
    this.innerProduct = product;
    this.disabledButtonPropertyHandler();
  }

  private disabledButtonPropertyHandler(): void {
    if (isEqual(this.innerProduct, this.product)) {
      this.updateDisabled = true;
    } else {
      this.updateDisabled = false;
    }
  }

  private updateDetailsDisplayType(width: number): void {
    if (this.shoudDisplayDetailsInColumn(width)) {
      this.detailsDisplay = ProductDetailsDisplayType.COLUMN;
    } else {
      this.detailsDisplay = ProductDetailsDisplayType.ROW;
    }
  }

  private shoudDisplayDetailsInColumn(width: number): boolean {
    return width < this.productDetailsDisplayChangeThreshold;
  }

  private setInitialAmount(): void {
    this.amount.setValue(
      this.userProduct?.amount || this.product?.amount || 100
    );
    this.changeDectorRef.detectChanges();
  }

  private subscribeToAmountChanges(): void {
    this.subscriptions.add(
      this.amount.valueChanges
        .pipe(filter(() => !!this.product))
        .subscribe((amount: number) => this.calculateProductValues(amount))
    );
  }

  private calculateProductValues(amount: number): void {
    this.innerProduct = calculateProductValues(amount, this.product);
    this.innerProduct.amount = amount;
    this.changeDectorRef.detectChanges();
  }
}
