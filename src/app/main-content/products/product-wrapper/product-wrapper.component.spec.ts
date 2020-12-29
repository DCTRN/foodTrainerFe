import {
  Component,
  EventEmitter,
  Input,
  NO_ERRORS_SCHEMA,
  Output,
} from '@angular/core';
import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Product } from '@core/models/products';
import { product1, product2 } from '@testsUT/products/products-mock-data.model';
import { DisplayType } from '../product-details/product-details.component';
import {
  ButtonAction,
  ProductAction,
  ProductWrapperComponent,
  ProductWrapperDisplayType,
} from './product-wrapper.component';

@Component({
  selector: 'app-product-details',
  template: '',
})
export class ProductDetailsComponent {
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

  public triggerValueEvent(product: Product): void {
    this.value.emit(product);
  }
}

describe('ProductWrapperComponent', () => {
  let injector: TestBed;
  let component: ProductWrapperComponent;
  let fixture: ComponentFixture<ProductWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductWrapperComponent, ProductDetailsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    fixture = TestBed.createComponent(ProductWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle', () => {
    expect(component.expandend).toBeFalse();

    component.toggle();

    expect(component.expandend).toBeTrue();
  });

  it('should configure child component in Product display mode', () => {
    component.display = ProductWrapperDisplayType.PRODUCT;
    component.product = product1;
    component.ngOnInit();
    fixture.detectChanges();

    const details = fixture.debugElement.query(
      By.directive(ProductDetailsComponent)
    );
    const detailsComponent = details.componentInstance as ProductDetailsComponent;

    expect(detailsComponent.readonly).toEqual(false);
    expect(detailsComponent.product).toEqual(product1);
  });

  it('should display product data', () => {
    component.product = product1;
    component.ngOnInit();
    fixture.detectChanges();

    const title = document.getElementById('title').innerText;
    const description = document.getElementById('description').innerText;

    expect(title).toContain(product1.producer);
    expect(title).toContain(product1.name);
    expect(description).toContain(product1.unit);
    expect(description).toContain(String(product1.amount));
    expect(description).toContain(String(product1.kcal));
  });

  it('should display modify and delete button in product display mode', () => {
    component.display = ProductWrapperDisplayType.PRODUCT;
    component.product = product1;
    component.ngOnInit();
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(By.css('#delete-button'));
    const updateButton = fixture.debugElement.query(By.css('#update-button'));

    expect(deleteButton).toBeTruthy();
    expect(updateButton).toBeTruthy();
  });

  it('should not display modify and delete button in diary display mode', () => {
    component.display = ProductWrapperDisplayType.DIARY;
    component.product = product1;
    component.ngOnInit();
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(By.css('#delete-button'));
    const updateButton = fixture.debugElement.query(By.css('#update-button'));

    expect(deleteButton).toBeFalsy();
    expect(updateButton).toBeFalsy();
  });

  it('should emit event with updated product data and button action in product mode', () => {
    let action: ProductAction;
    spyOn(component.action, 'emit').and.callFake(
      (a: ProductAction) => (action = a)
    );
    component.display = ProductWrapperDisplayType.PRODUCT;
    component.product = product1;
    component.ngOnInit();
    fixture.detectChanges();

    const details = fixture.debugElement.query(
      By.directive(ProductDetailsComponent)
    );
    const detailsComponent = details.componentInstance as ProductDetailsComponent;
    detailsComponent.triggerValueEvent(product1);
    const deleteButton = fixture.debugElement.query(By.css('#delete-button'));
    const updateButton = fixture.debugElement.query(By.css('#update-button'));

    deleteButton.triggerEventHandler('click', {});
    expect(action.action).toEqual(ButtonAction.DELETE);
    expect(action.product).toEqual(product1);

    detailsComponent.triggerValueEvent(product2);
    updateButton.triggerEventHandler('click', {});
    expect(action.action).toEqual(ButtonAction.UPDATE);
    expect(action.product).toEqual(product2);
  });

  it('should emit add event whend button clicked in diary mode', () => {
    let action: ProductAction;
    spyOn(component.action, 'emit').and.callFake(
      (a: ProductAction) => (action = a)
    );
    component.display = ProductWrapperDisplayType.DIARY;
    component.product = product1;
    component.ngOnInit();
    fixture.detectChanges();

    const addButton = fixture.debugElement.query(By.css('#add-button'));

    addButton.triggerEventHandler('click', {});
    expect(action.action).toEqual(ButtonAction.ADD);
    expect(action.product).toEqual(product1);
  });

  it('should set amount equal product default amount', async () => {
    component.display = ProductWrapperDisplayType.DIARY;
    component.product = product1;
    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.amount.value).toEqual(product1.amount);
  });

  it('should recalculate product properties and emit them on add button click', async () => {
    let action: ProductAction;
    spyOn(component.action, 'emit').and.callFake(
      (a: ProductAction) => (action = a)
    );
    component.display = ProductWrapperDisplayType.DIARY;
    component.product = product1;
    component.ngOnInit();
    fixture.detectChanges();
    component.amount.setValue(product1.amount * 2);

    const addButton = fixture.debugElement.query(By.css('#add-button'));
    addButton.triggerEventHandler('click', {});

    expect(action.action).toEqual(ButtonAction.ADD);
    expect(action.product.kcal).toEqual(product1.kcal * 2);
    expect(action.product.protein).toEqual(product1.protein * 2);
    expect(action.product.carbohydrates).toEqual(product1.carbohydrates * 2);
    expect(action.product.fats).toEqual(product1.fats * 2);
    expect(action.product.amount).toEqual(product1.amount * 2);
  });

  it('should change details display type on window resize', async () => {
    component.display = ProductWrapperDisplayType.DIARY;
    component.product = product1;
    component.ngOnInit();
    fixture.detectChanges();

    const detailsComponent = fixture.debugElement.query(
      By.directive(ProductDetailsComponent)
    ).componentInstance as ProductDetailsComponent;

    expect(detailsComponent.display).toEqual(DisplayType.COLUMN);

    component.onResize({ target: { innerWidth: 1980 } });
    fixture.detectChanges();

    expect(detailsComponent.display).toEqual(DisplayType.ROW);

    component.onResize({ target: { innerWidth: 360 } });
    fixture.detectChanges();

    expect(detailsComponent.display).toEqual(DisplayType.COLUMN);
  });
});
