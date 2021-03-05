import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
import { SimpleErrorStateMatcher } from '@utils/simple-error-state-matcher.class';

@Component({
  selector: 'app-product-details',
  template: '',
})
export class ProductDetailsComponent {
  @Input()
  public fontSize: number = 80;
  @Input()
  public display: ProductDetailsDisplayType = ProductDetailsDisplayType.COLUMN;
  @Input()
  public readonly = true;
  @Input()
  public product: Product = {
    id: undefined,
    producer: undefined,
    name: undefined,
    unit: undefined,
    amount: undefined,
    kcal: undefined,
    protein: undefined,
    carbohydrates: undefined,
    fats: undefined,
    creatorId: undefined,
  };

  @Output()
  public value = new EventEmitter<Product>();

  public simpleErrorStateMatcher = new SimpleErrorStateMatcher();

  public producer: FormControl = new FormControl('');
  public name: FormControl = new FormControl('');
  public unit: FormControl = new FormControl('');
  public amount: FormControl = new FormControl('');
  public kcal: FormControl = new FormControl('');
  public protein: FormControl = new FormControl('');
  public carbohydrates: FormControl = new FormControl('');
  public fats: FormControl = new FormControl('');
  public formGroup: FormGroup = new FormGroup({
    producer: this.producer,
    name: this.name,
    unit: this.unit,
    amout: this.amount,
    kcal: this.kcal,
    protein: this.protein,
    carbohydrates: this.carbohydrates,
    fats: this.fats,
  });

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

  public ngOnInit(): void {}

  public ngOnDestroy(): void {}

  public onClick(buttonAction: ButtonAction): void {}

  public onToggle(): void {}

  public onValue(product: Product): void {}

  public triggerToggleEvent(status: ProductExpandStatus): void {
    this.toggle.emit(status);
  }

  public triggerDiaryToggleEvent(status: UserProductExpandStatus): void {
    this.diaryToggle.emit(status);
  }

  public triggerProductActionEvent(action: ProductAction): void {
    this.productAction.emit(action);
  }

  public triggerDiaryActionEvent(action: DiaryAction): void {
    this.diaryAction.emit(action);
  }
}

@Component({
  selector: 'app-products-list',
  template: '',
})
export class ProductsListComponent {
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

  public triggerProductAction(action: ProductAction): void {
    this.productAction.emit(action);
  }

  public triggerDiaryAction(action: DiaryAction): void {
    this.diaryAction.emit(action);
  }

  public onProductAction(action: ProductAction): void {
    this.productAction.emit(action);
  }

  public onDiaryAction(action: DiaryAction): void {
    this.diaryAction.emit(action);
  }

  public onToggle(product: ProductExpandStatus): void {}

  public onDiaryToggle(userProduct: UserProductExpandStatus): void {}
}
