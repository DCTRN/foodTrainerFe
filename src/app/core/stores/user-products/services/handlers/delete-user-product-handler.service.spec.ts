import { getTestBed, TestBed } from '@angular/core/testing';
import { UserProductsApiService } from '@api/user-products/user-products-api.service';
import { NotificationService } from '@core/notifications/service/notification.service';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { userInitial } from '@testsUT/products/products-mock-data.model';
import { NotificationServiceMock } from '@testsUT/shared/shared-mock-services.model';
import { of, throwError } from 'rxjs';
import { UserProductsAction } from '../../user-products.actions';
import { UserProductsApiServiceMock } from './add-user-product-handler.service.spec';
import { DeleteUserProductHandlerService } from './delete-user-product-handler.service';

describe('DeleteUserProductHandlerService', () => {
  const initialState = { user: userInitial };
  let injector: TestBed;
  let service: DeleteUserProductHandlerService;
  let userProductsApiService: UserProductsApiService;
  let notificationService: NotificationService;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DeleteUserProductHandlerService,
        provideMockStore({ initialState }),
        {
          provide: UserProductsApiService,
          useClass: UserProductsApiServiceMock,
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
    userProductsApiService = injector.inject(UserProductsApiService);
    notificationService = injector.inject(NotificationService);
    store = injector.inject(MockStore);
    service = injector.inject(DeleteUserProductHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should delete user product successfully', () => {
    const actionArgument = UserProductsAction.DELETE_USER_PRODUCT_REQUEST({
      userProductDeletion: { userProductId: 1 },
    });
    let action: Action;
    spyOn(userProductsApiService, 'deleteUserProduct').and.returnValue(of({}));
    spyOn(notificationService, 'error');

    service.handle(actionArgument).subscribe((a) => (action = a));

    expect(userProductsApiService.deleteUserProduct).toHaveBeenCalled();
    expect(notificationService.error).not.toHaveBeenCalled();
    expect(action).toEqual(
      UserProductsAction.DELETE_USER_PRODUCT_REQUEST_SUCCESS({ id: 1 })
    );
  });

  it('should fail to delete user product', () => {
    const actionArgument = UserProductsAction.DELETE_USER_PRODUCT_REQUEST({
      userProductDeletion: { userProductId: 1 },
    });
    let action: Action;
    spyOn(userProductsApiService, 'deleteUserProduct').and.returnValue(
      throwError('Error')
    );
    spyOn(notificationService, 'error');

    service.handle(actionArgument).subscribe((a) => (action = a));

    expect(userProductsApiService.deleteUserProduct).toHaveBeenCalled();
    expect(notificationService.error).toHaveBeenCalled();
    expect(action).toEqual(
      UserProductsAction.DELETE_USER_PRODUCT_REQUEST_ERROR()
    );
  });
});
