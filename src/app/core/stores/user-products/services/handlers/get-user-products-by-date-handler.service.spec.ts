import { getTestBed, TestBed } from '@angular/core/testing';
import { UserProductsApiService } from '@api/user-products/user-products-api.service';
import { NotificationService } from '@core/notifications/service/notification.service';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { userInitial } from '@testsUT/products/products-mock-data.model';
import { NotificationServiceMock } from '@testsUT/shared/shared-mock-services.model';
import {
  userProduct1,
  userProduct2,
  userProductByDate,
} from '@testsUT/user-products/user-products-mock-data.model';
import { of, throwError } from 'rxjs';
import { UserProductsAction } from '../../user-products.actions';
import { UserProductsApiServiceMock } from './add-user-product-handler.service.spec';
import { DeleteUserProductHandlerService } from './delete-user-product-handler.service';
import { GetUserProductsByDateHandlerService } from './get-user-products-by-date-handler.service';

describe('GetUserProductsByDateHandlerService', () => {
  const initialState = { user: userInitial };
  let injector: TestBed;
  let service: GetUserProductsByDateHandlerService;
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
    service = injector.inject(GetUserProductsByDateHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user products by date successfully', () => {
    const userProductsMock = [userProduct1, userProduct2];
    const actionArgument = UserProductsAction.GET_USER_PRODUCTS_BY_DATE_REQUEST(
      { userProductsBy: { date: userProductByDate.date } }
    );
    let action: Action;
    spyOn(userProductsApiService, 'findUserProductsByDate').and.returnValue(
      of(userProductsMock)
    );
    spyOn(notificationService, 'error');

    service.handle(actionArgument).subscribe((a) => (action = a));

    expect(userProductsApiService.findUserProductsByDate).toHaveBeenCalled();
    expect(notificationService.error).not.toHaveBeenCalled();
    expect(action).toEqual(
      UserProductsAction.GET_USER_PRODUCTS_BY_DATE_REQUEST_SUCCESS({
        userProducts: userProductsMock,
      })
    );
  });

  it('should fail to get user products by date', () => {
    const userProductsMock = [userProduct1, userProduct2];
    const actionArgument = UserProductsAction.GET_USER_PRODUCTS_BY_DATE_REQUEST(
      { userProductsBy: { date: userProductByDate.date } }
    );
    let action: Action;
    spyOn(userProductsApiService, 'findUserProductsByDate').and.returnValue(
      throwError('Error')
    );
    spyOn(notificationService, 'error');

    service.handle(actionArgument).subscribe((a) => (action = a));

    expect(userProductsApiService.findUserProductsByDate).toHaveBeenCalled();
    expect(notificationService.error).toHaveBeenCalled();
    expect(action).toEqual(
      UserProductsAction.GET_USER_PRODUCTS_BY_DATE_REQUEST_ERROR()
    );
  });
});
