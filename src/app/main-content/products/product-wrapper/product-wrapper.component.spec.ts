import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ProductAction,
  ProductDetailsDisplayType,
  ProductExpandStatus,
  ProductWrapperDisplayType,
} from '@core/models/products';
import { ButtonAction } from '@core/models/products/button-action.enum';
import { UserProductExpandStatus } from '@core/models/products/user-product-expaned-status.interface';
import { ProductDetailsComponent } from '@testsUT/products/products-mock-components.model';
import { product1, product2 } from '@testsUT/products/products-mock-data.model';
import { userProduct1 } from '@testsUT/user-products/user-products-mock-data.model';
import { ProductWrapperComponent } from './product-wrapper.component';

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

  it('should toggle product', () => {
    let productExpandStatus: ProductExpandStatus;
    spyOn(component.toggle, 'emit').and.callThrough();

    component.display = ProductWrapperDisplayType.PRODUCT;
    component.product = product1;
    component.ngOnInit();
    expect(component.expanded).toBeFalse();

    component.toggle.subscribe(
      (status: ProductExpandStatus) => (productExpandStatus = status)
    );
    component.onToggle();

    expect(component.expanded).toBeTrue();
    expect(productExpandStatus.expanded).toEqual(component.expanded);
    expect(productExpandStatus.product.id).toEqual(component.product.id);
  });

  it('should toggle user product', () => {
    let productExpandStatus: UserProductExpandStatus;
    spyOn(component.diaryToggle, 'emit').and.callThrough();

    component.display = ProductWrapperDisplayType.DIARY_SEARCH;
    component.userProduct = userProduct1;
    component.ngOnInit();
    expect(component.expanded).toBeFalse();

    component.diaryToggle.subscribe(
      (status: UserProductExpandStatus) => (productExpandStatus = status)
    );
    component.onToggle();

    expect(component.expanded).toBeTrue();
    expect(productExpandStatus.expanded).toEqual(component.expanded);
    expect(productExpandStatus.userProduct.id).toEqual(
      component.userProduct.id
    );
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
    component.display = ProductWrapperDisplayType.DIARY_SEARCH;
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
    spyOn(component.productAction, 'emit').and.callFake(
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

    deleteButton.triggerEventHandler('click', { stopPropagation: () => {} });
    expect(action.action).toEqual(ButtonAction.DELETE);
    expect(action.product).toEqual(product1);

    detailsComponent.triggerValueEvent(product2);
    updateButton.triggerEventHandler('click', { stopPropagation: () => {} });
    expect(action.action).toEqual(ButtonAction.UPDATE);
    expect(action.product).toEqual(product2);
  });

  it('should emit add event when button clicked in diary mode', () => {
    let action: ProductAction;
    spyOn(component.productAction, 'emit').and.callFake(
      (a: ProductAction) => (action = a)
    );
    component.display = ProductWrapperDisplayType.DIARY_SEARCH;
    component.product = product1;
    component.ngOnInit();
    fixture.detectChanges();

    const addButton = fixture.debugElement.query(By.css('#add-button'));
    addButton.triggerEventHandler('click', { stopPropagation: () => {} });

    expect(action.action).toEqual(ButtonAction.ADD);
    expect(action.product).toEqual(product1);
  });

  it('should set amount equal product default amount', async () => {
    component.display = ProductWrapperDisplayType.DIARY_SEARCH;
    component.product = product1;
    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.amount.value).toEqual(product1.amount);
  });

  it('should recalculate product properties and emit them on add button click', async () => {
    let action: ProductAction;
    spyOn(component.productAction, 'emit').and.callFake(
      (a: ProductAction) => (action = a)
    );
    component.display = ProductWrapperDisplayType.DIARY_SEARCH;
    component.product = product1;
    component.ngOnInit();
    component.amount.setValue(product1.amount * 2);
    fixture.detectChanges();

    const addButton = fixture.debugElement.query(By.css('#add-button'));
    addButton.triggerEventHandler('click', { stopPropagation: () => {} });

    expect(action.action).toEqual(ButtonAction.ADD);
    expect(component.innerProduct.kcal).toEqual(product1.kcal * 2);
    expect(component.innerProduct.protein).toEqual(product1.protein * 2);
    expect(component.innerProduct.carbohydrates).toEqual(
      product1.carbohydrates * 2
    );
    expect(component.innerProduct.fats).toEqual(product1.fats * 2);
    expect(component.innerProduct.amount).toEqual(product1.amount * 2);
  });

  it('should change details display type on window resize', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(360);
    component.display = ProductWrapperDisplayType.DIARY_SEARCH;
    component.product = product1;
    component.ngOnInit();
    fixture.detectChanges();

    const detailsComponent = fixture.debugElement.query(
      By.directive(ProductDetailsComponent)
    ).componentInstance as ProductDetailsComponent;

    expect(detailsComponent.display).toEqual(ProductDetailsDisplayType.COLUMN);

    component.onResize({ target: { innerWidth: 1980 } });
    fixture.detectChanges();

    expect(detailsComponent.display).toEqual(ProductDetailsDisplayType.ROW);

    component.onResize({ target: { innerWidth: 360 } });
    fixture.detectChanges();

    expect(detailsComponent.display).toEqual(ProductDetailsDisplayType.COLUMN);
  });

  it('should disable add button when value is invalid', async () => {
    const addButtonSelector = '#add-button';
    component.display = ProductWrapperDisplayType.DIARY_SEARCH;
    component.product = product1;
    component.ngOnInit();
    fixture.detectChanges();

    component.amount.setValue(-1);
    fixture.detectChanges();

    let addButton = fixture.debugElement.query(By.css(addButtonSelector))
      .nativeElement;

    expect(addButton.disabled).toBeTrue();

    component.amount.setValue(100);
    fixture.detectChanges();

    addButton = fixture.debugElement.query(By.css(addButtonSelector))
      .nativeElement;

    expect(addButton.disabled).toBeFalse();
  });

  it('should disable update button when value is invalid', async () => {
    const updateButtonselector = '#diary-update-button';
    component.display = ProductWrapperDisplayType.DIARY_SUMMARY;
    component.product = product1;
    component.ngOnInit();
    fixture.detectChanges();

    component.amount.setValue(-1);
    fixture.detectChanges();

    let diaryUpdateButton = fixture.debugElement.query(
      By.css(updateButtonselector)
    ).nativeElement;

    expect(diaryUpdateButton.disabled).toBeTrue();

    component.amount.setValue(100);
    fixture.detectChanges();

    diaryUpdateButton = fixture.debugElement.query(By.css(updateButtonselector))
      .nativeElement;

    expect(diaryUpdateButton.disabled).toBeFalse();
  });

  it('should disable update button when value is not changed', async () => {
    const updateButtonselector = '#diary-update-button';
    component.display = ProductWrapperDisplayType.DIARY_SUMMARY;
    component.userProduct = userProduct1;
    component.ngOnInit();
    fixture.detectChanges();

    fixture.detectChanges();

    let diaryUpdateButton = fixture.debugElement.query(
      By.css(updateButtonselector)
    ).nativeElement;

    expect(diaryUpdateButton.disabled).toBeTrue();

    component.amount.setValue(500);
    fixture.detectChanges();

    diaryUpdateButton = fixture.debugElement.query(By.css(updateButtonselector))
      .nativeElement;

    expect(diaryUpdateButton.disabled).toBeFalse();
  });
});
