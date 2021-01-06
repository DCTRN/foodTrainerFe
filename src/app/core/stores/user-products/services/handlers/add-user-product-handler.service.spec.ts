import { getTestBed, TestBed } from '@angular/core/testing';
import { UserProductsApiService } from '@api/user-products/user-products-api.service';
import {
  UserProduct,
  UserProductDeletion,
  UserProductModification,
  UserProductsByDate,
  UserProductsByDateRange,
} from '@core/models/user-products';
import { NotificationService } from '@core/notifications/service/notification.service';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { userInitial } from '@testsUT/products/products-mock-data.model';
import { NotificationServiceMock } from '@testsUT/shared/shared-mock-services.model';
import { userProduct1 } from '@testsUT/user-products/user-products-mock-data.model';
import { Observable, of, throwError } from 'rxjs';
import { UserProductsAction } from '../../user-products.actions';
import { AddUserProductHandlerService } from './add-user-product-handler.service';

export class UserProductsApiServiceMock {
  public findUserProductsByDate(
    date: UserProductsByDate
  ): Observable<UserProduct[]> {
    return of(null);
  }

  public findUserProductsByDateRange(
    date: UserProductsByDateRange
  ): Observable<UserProduct[]> {
    return of(null);
  }

  public addUserProduct(userProduct: UserProduct): Observable<UserProduct> {
    return of(null);
  }

  public updateUserProduct(
    userProduct: UserProductModification
  ): Observable<UserProduct> {
    return of(null);
  }

  public deleteUserProduct(
    userProduct: UserProductDeletion
  ): Observable<Object> {
    return of(null);
  }
}

const initialState = { user: userInitial };

describe('AddUserProductHandlerService', () => {
  let injector: TestBed;
  let service: AddUserProductHandlerService;
  let userProductsApiService: UserProductsApiService;
  let notificationService: NotificationService;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
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
    service = injector.inject(AddUserProductHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TODO finish this
  it('should add user product successfully', () => {
    const actionArgument = UserProductsAction.ADD_USER_PRODUCT_REQUEST({
      userProduct: userProduct1,
    });
    let action: Action;
    spyOn(userProductsApiService, 'addUserProduct').and.returnValue(
      of(userProduct1)
    );
    spyOn(notificationService, 'error');

    service.handle(actionArgument).subscribe((a: Action) => (action = a));

    expect(userProductsApiService.addUserProduct).toHaveBeenCalled();
    expect(notificationService.error).not.toHaveBeenCalled();
    expect(action).toEqual(
      UserProductsAction.ADD_USER_PRODUCT_REQUEST_SUCCESS({
        userProduct: userProduct1,
      })
    );
  });

  it('should fail to add user product', () => {
    const actionArgument = UserProductsAction.ADD_USER_PRODUCT_REQUEST({
      userProduct: userProduct1,
    });
    let action: Action;
    spyOn(userProductsApiService, 'addUserProduct').and.returnValue(
      throwError('Error')
    );
    spyOn(notificationService, 'error');

    service.handle(actionArgument).subscribe((a: Action) => (action = a));

    expect(userProductsApiService.addUserProduct).toHaveBeenCalled();
    expect(notificationService.error).toHaveBeenCalled();
    expect(action).toEqual(UserProductsAction.ADD_USER_PRODUCT_REQUEST_ERROR());
  });
});
