import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Product } from '@core/models/products';
import { SimpleErrorStateMatcher } from '@utils/simple-error-state-matcher.class';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ProductDetailsDisplayType } from '../../../core/models/products/product-details-display-type.enum';

interface KeyValue {
  [key: string]: any;
}

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  public fontSize: number = 80;
  @Input()
  public display: ProductDetailsDisplayType = ProductDetailsDisplayType.COLUMN;
  @Input()
  public readonly = true;
  @Input()
  public product: Product;

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
      this.formGroup.controls[key].setValue(this.product[key]);
    }
  }

  private extractObjectKeys(controls: KeyValue): string[] {
    return Object.keys(controls);
  }

  private subscribeToFormChanges(): void {
    this.subscriptions.add(
      this.formGroup.valueChanges
        .pipe(filter(() => !this.readonly))
        .subscribe((changes: KeyValue) => this.updateState(changes))
    );
  }

  private updateState(changes: KeyValue): void {
    this.updateProduct(changes);
    this.emitValue();
  }

  private emitValue(): void {
    this.value.emit(this.product);
  }

  private updateProduct(changes: KeyValue): void {
    const keys = this.extractObjectKeys(changes);
    for (const key of keys) {
      this.product[key] = changes[key];
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
