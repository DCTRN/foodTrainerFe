import { getTestBed, TestBed } from '@angular/core/testing';
import { ProductsApiService } from '@api/products/products-api.service';
import { Product } from '@core/models/products';
import { NotificationService } from '@core/notifications/service/notification.service';
import { Action } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { product1 } from '@testsUT/products/products-mock-data.model';
import { ProductsApiServiceMock } from '@testsUT/products/products-mock-services.model';
import { NotificationServiceMock } from '@testsUT/shared/shared-mock-services.model';
import { of, throwError } from 'rxjs';
import { ProductsAction, ProductsActionType } from '../../products.actions';
import { AddProductHandlerService } from './add-product-handler.service';

describe('AddProductHandlerService', () => {
  let injector: TestBed;
  let service: AddProductHandlerService;
  let productsApiService: ProductsApiService;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ProductsApiService,
          useClass: ProductsApiServiceMock,
        },
        {
          provide: NotificationService,
          useClass: NotificationServiceMock,
        },
      ],
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    notificationService = injector.inject(NotificationService);
    productsApiService = injector.inject(ProductsApiService);
    service = TestBed.inject(AddProductHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add product successfully', () => {
    let action: Action;
    const actionArgument = ProductsAction.ADD_PRODUCT_REQUEST({
      product: product1,
    });
    spyOn(notificationService, 'error');
    spyOn(productsApiService, 'addProduct').and.returnValue(of(product1));

    service
      .handle(actionArgument)
      .subscribe(
        (a: { product: Product } & TypedAction<string>) => (action = a)
      );

    expect(notificationService.error).not.toHaveBeenCalled();
    expect(productsApiService.addProduct).toHaveBeenCalled();
    expect(action.type).toEqual(ProductsActionType.ADD_PRODUCT_REQUEST_SUCCESS);
    expect(action).toEqual(
      ProductsAction.ADD_PRODUCT_REQUEST_SUCCESS({ product: product1 })
    );
  });

  it('should fail to add product', () => {
    let action: Action;
    const actionArgument = ProductsAction.ADD_PRODUCT_REQUEST({
      product: product1,
    });
    spyOn(notificationService, 'error');
    spyOn(productsApiService, 'addProduct').and.returnValue(
      throwError('Error')
    );

    service
      .handle(actionArgument)
      .subscribe(
        (a: { product: Product } & TypedAction<string>) => (action = a)
      );

    expect(notificationService.error).toHaveBeenCalled();
    expect(productsApiService.addProduct).toHaveBeenCalled();
    expect(action.type).toEqual(ProductsActionType.ADD_PRODUCT_REQUEST_ERROR);
    expect(action).toEqual(ProductsAction.ADD_PRODUCT_REQUEST_ERROR());
  });
});
