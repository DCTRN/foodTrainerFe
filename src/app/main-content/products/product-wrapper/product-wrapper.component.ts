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
  ProductWrapperDisplayType,
} from '@core/models/products';
import {
  convertToPrecision,
  multipleBy,
  subtractBy,
} from '@core/util-functions/util-functions';
import { cloneDeep } from 'lodash';
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
  public display: ProductWrapperDisplayType = ProductWrapperDisplayType.DIARY;

  @Output()
  public action: EventEmitter<ProductAction> = new EventEmitter<ProductAction>();

  public detailsDisplay: ProductDetailsDisplayType =
    ProductDetailsDisplayType.COLUMN;
  public innerProduct: Product;
  public expandend = false;
  public productWrapperDisplayType = ProductWrapperDisplayType;
  public buttonAction = ButtonAction;
  public amount = new FormControl('', [
    Validators.required,
    Validators.minLength(1),
  ]);

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
    this.updateDetailsDisplayType(window.innerWidth);
    this.subscribeToAmountChanges();
    this.setInitialAmount();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onClick(buttonAction: ButtonAction): void {
    this.action.emit({ action: buttonAction, product: this.innerProduct });
  }

  public toggle(): void {
    this.expandend = !this.expandend;
  }

  public onValue(product: Product): void {
    this.innerProduct = cloneDeep(product);
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
