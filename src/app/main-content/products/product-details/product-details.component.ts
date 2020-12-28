import {
  ChangeDetectorRef,
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

export enum DisplayType {
  COLUMN = 'wrapper-column',
  ROW = 'wrapper-row',
}

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
  public fontSize: number = 60;
  @Input()
  public display: DisplayType = DisplayType.COLUMN;
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

  constructor(
    private formBuilder: FormBuilder,
    private changeDectorRef: ChangeDetectorRef
  ) {}

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

  private createFormGroup() {
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

  private createFormControls() {
    this.createProducer();
    this.createName();
    this.createUnit();
    this.createAmount();
    this.createKcal();
    this.createProtein();
    this.createCarbohydrates();
    this.createFats();
  }

  private createFats() {
    this.fats = new FormControl('', [Validators.required]);
  }
  private createCarbohydrates() {
    this.carbohydrates = new FormControl('', [Validators.required]);
  }
  private createProtein() {
    this.protein = new FormControl('', [Validators.required]);
  }
  private createKcal() {
    this.kcal = new FormControl('', [Validators.required]);
  }

  private createAmount() {
    this.amount = new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]);
  }

  private createUnit() {
    this.unit = new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(30),
    ]);
  }

  private createName() {
    this.name = new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(30),
    ]);
  }

  private createProducer() {
    this.producer = new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(30),
    ]);
  }
}
