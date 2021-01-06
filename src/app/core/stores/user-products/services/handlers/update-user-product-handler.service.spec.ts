import { getTestBed, TestBed } from '@angular/core/testing';
import { UserProductsApiService } from '@api/user-products/user-products-api.service';
import { NotificationService } from '@core/notifications/service/notification.service';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { userInitial } from '@testsUT/products/products-mock-data.model';
import { NotificationServiceMock } from '@testsUT/shared/shared-mock-services.model';
import { userProduct1 } from '@testsUT/user-products/user-products-mock-data.model';
import { of, throwError } from 'rxjs';
import { UserProductsAction } from '../../user-products.actions';
import { UserProductsApiServiceMock } from './add-user-product-handler.service.spec';
import { UpdateUserProductHandlerService } from './update-user-product-handler.service';

describe('UpdateUserProductHandlerService', () => {
  const initialState = { user: userInitial };
  let injector: TestBed;
  let service: UpdateUserProductHandlerService;
  let userProductsApiService: UserProductsApiService;
  let notificationService: NotificationService;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UpdateUserProductHandlerService,
        provideMockStore({ initialState }),
        {
          provide: NotificationService,
          useClass: NotificationServiceMock,
        },
        {
          provide: UserProductsApiService,
          useClass: UserProductsApiServiceMock,
        },
      ],
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    userProductsApiService = injector.inject(UserProductsApiService);
    notificationService = injector.inject(NotificationService);
    store = injector.inject(MockStore);
    service = injector.inject(UpdateUserProductHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update user product successfully', () => {
    const actionArgument = UserProductsAction.UPDATE_USER_PRODUCT_REQUEST({
      userProductModification: { product: userProduct1 },
    });
    let action: Action;
    spyOn(userProductsApiService, 'updateUserProduct').and.returnValue(
      of(userProduct1)
    );
    spyOn(notificationService, 'error');

    service.handle(actionArgument).subscribe((a: Action) => (action = a));

    expect(userProductsApiService.updateUserProduct).toHaveBeenCalled();
    expect(notificationService.error).not.toHaveBeenCalled();
    expect(action).toEqual(
      UserProductsAction.UPDATE_USER_PRODUCT_REQUEST_SUCCESS({
        userProduct: userProduct1,
      })
    );
  });

  it('should fail to update user product', () => {
    const actionArgument = UserProductsAction.UPDATE_USER_PRODUCT_REQUEST({
      userProductModification: { product: userProduct1 },
    });
    let action: Action;
    spyOn(userProductsApiService, 'updateUserProduct').and.returnValue(
      throwError('Error')
    );
    spyOn(notificationService, 'error');

    service.handle(actionArgument).subscribe((a: Action) => (action = a));

    expect(userProductsApiService.updateUserProduct).toHaveBeenCalled();
    expect(notificationService.error).toHaveBeenCalled();
    expect(action).toEqual(
      UserProductsAction.UPDATE_USER_PRODUCT_REQUEST_ERROR()
    );
  });
});
