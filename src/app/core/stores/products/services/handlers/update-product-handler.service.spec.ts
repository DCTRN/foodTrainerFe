import { getTestBed, TestBed } from '@angular/core/testing';
import { ProductsApiService } from '@api/products/products-api.service';
import { NotificationService } from '@core/notifications/service/notification.service';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  product1,
  userInitial,
} from '@testsUT/products/products-mock-data.model';
import { ProductsApiServiceMock } from '@testsUT/products/products-mock-services.model';
import { NotificationServiceMock } from '@testsUT/shared/shared-mock-services.model';
import { of, throwError } from 'rxjs';
import { ProductsAction, ProductsActionType } from '../../products.actions';
import { UpdateProductHandlerService } from './update-product-handler.service';

export const initialState = { user: userInitial };

describe('UpdateProductHandlerService', () => {
  let injector: TestBed;
  let service: UpdateProductHandlerService;
  let productsApiService: ProductsApiService;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
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
    productsApiService = injector.inject(ProductsApiService);
    notificationService = injector.inject(NotificationService);
    service = injector.inject(UpdateProductHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update products successfully', () => {
    const product = product1;
    const actionArgument = ProductsAction.UPDATE_PRODUCT_REQUEST({ product });
    let action: Action;
    spyOn(productsApiService, 'updateProduct').and.returnValue(of(product));
    spyOn(notificationService, 'error');

    service.handle(actionArgument).subscribe((a) => (action = a));

    expect(productsApiService.updateProduct).toHaveBeenCalled();
    expect(notificationService.error).not.toHaveBeenCalled();
    expect(action).toEqual(
      ProductsAction.UPDATE_PRODUCT_REQUEST_SUCCESS({ product })
    );
    expect(action.type).toEqual(
      ProductsActionType.UPDATE_PRODUCT_REQUEST_SUCCESS
    );
  });

  it('should fail to update product', () => {
    const product = product1;
    const actionArgument = ProductsAction.UPDATE_PRODUCT_REQUEST({ product });
    let action: Action;
    spyOn(productsApiService, 'updateProduct').and.returnValue(
      throwError('Error')
    );
    spyOn(notificationService, 'error');

    service.handle(actionArgument).subscribe((a) => (action = a));

    expect(productsApiService.updateProduct).toHaveBeenCalled();
    expect(notificationService.error).toHaveBeenCalled();
    expect(action).toEqual(ProductsAction.UPDATE_PRODUCT_REQUEST_ERROR());
    expect(action.type).toEqual(
      ProductsActionType.UPDATE_PRODUCT_REQUEST_ERROR
    );
  });
});
