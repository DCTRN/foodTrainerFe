import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Product, ProductDetailsDisplayType } from '@core/models/products';
import { SimpleErrorStateMatcher } from '@utils/simple-error-state-matcher.class';
import { cloneDeep, isEqual } from 'lodash';
import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

interface KeyValue {
  [key: string]: any;
}

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
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

  public formGroup: FormGroup;
  public producer: FormControl;
  public name: FormControl;
  public unit: FormControl;
  public amount: FormControl;
  public kcal: FormControl;
  public protein: FormControl;
  public carbohydrates: FormControl;
  public fats: FormControl;

  private readonly signature = '[PRD.C]';
  private subscriptions = new Subscription();

  constructor(private formBuilder: FormBuilder) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const productChange = changes?.product as SimpleChange;
    if (isEqual(productChange?.currentValue, productChange?.previousValue)) {
      return;
    }
    this.updateForm();
  }

  public ngOnInit(): void {
    this.initializeComponent();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeComponent(): void {
    this.createFormControls();
    this.createFormGroup();
    this.updateForm();
    this.subscribeToFormChanges();
  }

  private updateForm(): void {
    const controls = this.formGroup?.controls;
    if (!this.product || !controls) {
      return;
    }
    this.updateFormControlsValues(controls);
  }

  private updateFormControlsValues(controls): void {
    const keys = this.extractObjectKeys(controls);
    for (const key of keys) {
      const shouldUpdateView = !isEqual(
        this.formGroup.controls[key].value,
        this.product[key]
      );
      if (!shouldUpdateView) {
        continue;
      }
      this.formGroup.controls[key].setValue(this.product[key]);
    }
  }

  private extractObjectKeys(controls: KeyValue): string[] {
    return Object.keys(controls);
  }

  private subscribeToFormChanges(): void {
    this.subscriptions.add(
      this.formGroup.valueChanges
        .pipe(
          filter(() => !this.readonly),
          tap((product: Product) => (product.id = this.product?.id)),
          filter((product: Product) => !isEqual(product, this.product))
        )
        .subscribe((product: Product) => this.updateState(product))
    );
  }

  private updateState(product: Product): void {
    this.updateProduct(product);
    this.emitValue();
  }

  private emitValue(): void {
    this.value.emit(cloneDeep(this.product));
  }

  private updateProduct(product: Product): void {
    const keys = this.extractObjectKeys(product);
    for (const key of keys) {
      if (isEqual(this.product[key], product[key])) {
        continue;
      }
      this.product[key] = product[key];
    }
  }

  private createFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      producer: this.producer,
      name: this.name,
      unit: this.unit,
      amount: this.amount,
      kcal: this.kcal,
      protein: this.protein,
      carbohydrates: this.carbohydrates,
      fats: this.fats,
    });
  }

  private createFormControls(): void {
    this.createProducer();
    this.createName();
    this.createUnit();
    this.createAmount();
    this.createKcal();
    this.createProtein();
    this.createCarbohydrates();
    this.createFats();
  }

  private createFats(): void {
    this.fats = new FormControl('', [Validators.required]);
  }
  private createCarbohydrates(): void {
    this.carbohydrates = new FormControl('', [Validators.required]);
  }
  private createProtein(): void {
    this.protein = new FormControl('', [Validators.required]);
  }
  private createKcal(): void {
    this.kcal = new FormControl('', [Validators.required]);
  }

  private createAmount(): void {
    this.amount = new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]);
  }

  private createUnit(): void {
    this.unit = new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(30),
    ]);
  }

  private createName(): void {
    this.name = new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(30),
    ]);
  }

  private createProducer(): void {
    this.producer = new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(30),
    ]);
  }
}
