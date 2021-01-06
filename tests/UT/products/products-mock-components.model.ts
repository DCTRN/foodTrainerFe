import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  Product,
  ProductAction,
  ProductDetailsDisplayType,
  ProductExpandStatus,
  ProductWrapperDisplayType,
} from '@core/models/products';
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
  public expanded: boolean = false;

  @Input()
  public display: ProductWrapperDisplayType = ProductWrapperDisplayType.DIARY_SEARCH;

  @Output()
  public action: EventEmitter<ProductAction> = new EventEmitter<ProductAction>();

  @Output()
  public toggle: EventEmitter<ProductExpandStatus> = new EventEmitter<ProductExpandStatus>();

  public triggerActionEvent(action: ProductAction): void {
    this.action.emit(action);
  }

  public triggerToggleEvent(status: ProductExpandStatus): void {
    this.toggle.emit(status);
  }
}
