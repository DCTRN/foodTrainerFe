import { getTestBed, TestBed } from '@angular/core/testing';
import { ProductsApiService } from '@api/products/products-api.service';
import { NotificationService } from '@core/notifications/service/notification.service';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { userInitial } from '@testsUT/products/products-mock-data.model';
import { ProductsApiServiceMock } from '@testsUT/products/products-mock-services.model';
import { NotificationServiceMock } from '@testsUT/shared/shared-mock-services.model';
import { of, throwError } from 'rxjs';
import { ProductsAction, ProductsActionType } from '../../products.actions';
import { DeleteProductHandlerService } from './delete-product-handler.service';

const initialState = { user: userInitial };

describe('DeleteProductHandlerService', () => {
  let injector: TestBed;
  let service: DeleteProductHandlerService;
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
    notificationService = injector.inject(NotificationService);
    productsApiService = injector.inject(ProductsApiService);
    service = injector.inject(DeleteProductHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should delete product successfully', () => {
    let action: Action;
    const actionArugment = ProductsAction.DELETE_PRODUCT_REQUEST({ id: 1 });
    spyOn(productsApiService, 'deleteProduct').and.returnValue(of({}));
    spyOn(notificationService, 'error');
    spyOn(notificationService, 'success');

    service.handle(actionArugment).subscribe((a) => (action = a));

    expect(productsApiService.deleteProduct).toHaveBeenCalled();
    expect(notificationService.success).toHaveBeenCalled();
    expect(notificationService.error).not.toHaveBeenCalled();
    expect(action.type).toEqual(
      ProductsActionType.DELETE_PRODUCT_REQUEST_SUCCESS
    );
    expect(action).toEqual(
      ProductsAction.DELETE_PRODUCT_REQUEST_SUCCESS({ id: 1 })
    );
  });

  it('should fail to delete product', () => {
    let action: Action;
    const actionArugment = ProductsAction.DELETE_PRODUCT_REQUEST({ id: 1 });
    spyOn(productsApiService, 'deleteProduct').and.returnValue(
      throwError('Error')
    );
    spyOn(notificationService, 'error');

    service.handle(actionArugment).subscribe((a) => (action = a));

    expect(productsApiService.deleteProduct).toHaveBeenCalled();
    expect(notificationService.error).toHaveBeenCalled();
    expect(action.type).toEqual(
      ProductsActionType.DELETE_PRODUCT_REQUEST_ERROR
    );
    expect(action).toEqual(ProductsAction.DELETE_PRODUCT_REQUEST_ERROR());
  });
});
