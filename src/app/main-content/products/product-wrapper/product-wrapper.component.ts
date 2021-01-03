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
import {
  convertToPrecision,
  multipleBy,
  subtractBy,
} from '@core/util-functions/util-functions';
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
  public expanded: boolean = false;

  @Input()
  public display: ProductWrapperDisplayType = ProductWrapperDisplayType.DIARY;

  @Output()
  public action: EventEmitter<ProductAction> = new EventEmitter<ProductAction>();

  @Output()
  public toggle: EventEmitter<ProductExpandStatus> = new EventEmitter<ProductExpandStatus>();

  public detailsDisplay: ProductDetailsDisplayType =
    ProductDetailsDisplayType.COLUMN;
  public innerProduct: Product;
  public detailsProduct: Product;
  public productWrapperDisplayType = ProductWrapperDisplayType;
  public buttonAction = ButtonAction;
  public amount = new FormControl('', [
    Validators.required,
    Validators.minLength(1),
  ]);
  public updateDisabled = true;

  private subscriptions = new Subscription();

  private readonly propertiesToRecalculate: string[] = [
    'kcal',
    'protein',
    'carbohydrates',
    'fats',
  ];
  private readonly productDetailsDisplayChangeThreshold = 1366;

  constructor(private changeDectorRef: ChangeDetectorRef) {}

  @HostListener('window:resize', ['$event'])
  public onResize(event): void {
    this.updateDetailsDisplayType(event.target.innerWidth);
  }

  public ngOnInit(): void {
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
    this.action.emit({
      action: buttonAction,
      product: cloneDeep(this.innerProduct),
    });
  }

  public onToggle(): void {
    this.expanded = !this.expanded;
    this.toggle.emit({
      product: cloneDeep(this.innerProduct),
      expanded: this.expanded,
    });
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
    if (this.display !== ProductWrapperDisplayType.DIARY) {
      return;
    }
    this.amount.setValue(this.product?.amount || 100);
    this.changeDectorRef.detectChanges();
  }

  private subscribeToAmountChanges(): void {
    this.subscriptions.add(
      this.amount.valueChanges
        .pipe(
          filter(() => !!this.product),
          filter(() => this.isDiaryMode())
        )
        .subscribe((amount: number) => this.calculateProductValues(amount))
    );
  }

  private isDiaryMode(): boolean {
    return this.display === this.productWrapperDisplayType.DIARY;
  }

  private calculateProductValues(amount: number): void {
    const percentage = this.calculatePercentage(amount);
    this.innerProduct.amount = amount;
    this.calculateProperty(percentage);
    this.innerProduct = cloneDeep(this.innerProduct);
    this.changeDectorRef.detectChanges();
  }

  private calculateProperty(percentage: number): void {
    this.propertiesToRecalculate.forEach(
      (key: string) =>
        (this.innerProduct[key] = convertToPrecision(
          multipleBy(this.product[key], percentage)
        ))
    );
  }

  private calculatePercentage(amount: number): number {
    return convertToPrecision(subtractBy(amount, this.product.amount));
  }
}
