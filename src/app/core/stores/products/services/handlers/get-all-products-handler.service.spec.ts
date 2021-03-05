import { getTestBed, TestBed } from '@angular/core/testing';
import { ProductsApiService } from '@api/products/products-api.service';
import { Product } from '@core/models/products';
import { NotificationService } from '@core/notifications/service/notification.service';
import { Action } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { provideMockStore } from '@ngrx/store/testing';
import {
  product1,
  product2,
  userInitial,
} from '@testsUT/products/products-mock-data.model';
import { ProductsApiServiceMock } from '@testsUT/products/products-mock-services.model';
import { NotificationServiceMock } from '@testsUT/shared/shared-mock-services.model';
import { of, throwError } from 'rxjs';
import {
  Products,
  ProductsAction,
  ProductsActionType,
} from '../../products.actions';
import { GetAllProductsHandlerService } from './get-all-products-handler.service';

export const initialState = { user: userInitial };

describe('GetAllProductsHandlerService', () => {
  let injector: TestBed;
  let service: GetAllProductsHandlerService;
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
    service = injector.inject(GetAllProductsHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user products successfully', () => {
    let action: Action;
    const products = [product1, product2];
    spyOn(notificationService, 'error');
    spyOn(productsApiService, 'findProductsByUserId').and.returnValue(
      of(products)
    );

    service
      .handle()
      .subscribe((a: Products & TypedAction<string>) => (action = a));

    expect(notificationService.error).not.toHaveBeenCalled();
    expect(productsApiService.findProductsByUserId).toHaveBeenCalledWith(
      userInitial.id
    );
    expect(action).toEqual(
      ProductsAction.GET_ALL_PRODUCTS_REQUEST_SUCCESS({
        products,
      })
    );
    expect(action.type).toEqual(
      ProductsActionType.GET_ALL_PRODUCTS_REQUEST_SUCCESS
    );
  });

  it('should fail to fetch user products', () => {
    let action: Action;
    spyOn(notificationService, 'error');
    spyOn(productsApiService, 'findProductsByUserId').and.returnValue(
      throwError('Error')
    );

    service
      .handle()
      .subscribe((a: Product[] & TypedAction<string>) => (action = a));

    expect(notificationService.error).toHaveBeenCalled();
    expect(productsApiService.findProductsByUserId).toHaveBeenCalledWith(
      userInitial.id
    );
    expect(action).toEqual(ProductsAction.GET_ALL_PRODUCTS_REQUEST_ERROR());
    expect(action.type).toEqual(
      ProductsActionType.GET_ALL_PRODUCTS_REQUEST_ERROR
    );
  });
});
