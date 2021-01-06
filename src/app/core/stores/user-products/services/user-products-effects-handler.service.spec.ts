import { Injector, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { InternalErrorHandlerService } from '@core/stores/common/internal-error-handler.service';
import { EffectHandler } from '@core/stores/models/effect-handler.interface';
import { Action } from '@ngrx/store';
import { UserProductsAction } from '../user-products.actions';
import { AddUserProductHandlerService } from './handlers/add-user-product-handler.service';
import { DeleteUserProductHandlerService } from './handlers/delete-user-product-handler.service';
import { GetUserProductsByDateHandlerService } from './handlers/get-user-products-by-date-handler.service';
import { GetUserProductsByDateRangeHandlerService } from './handlers/get-user-products-by-date-range-handler.service';
import { UpdateUserProductHandlerService } from './handlers/update-user-product-handler.service';
import { UserProductsEffectsHandlerService } from './user-products-effects-handler.service';

const actionsInput: Action[] = [
  UserProductsAction.GET_USER_PRODUCTS_BY_DATE_REQUEST,
  UserProductsAction.GET_USER_PRODUCTS_BY_DATE_RANGE_REQUEST,
  UserProductsAction.ADD_USER_PRODUCT_REQUEST,
  UserProductsAction.UPDATE_USER_PRODUCT_REQUEST,
  UserProductsAction.DELETE_USER_PRODUCT_REQUEST,
  UserProductsAction.DELETE_USER_PRODUCT_REQUEST_ERROR,
];

const expectedOutput: Type<EffectHandler>[] = [
  GetUserProductsByDateHandlerService,
  GetUserProductsByDateRangeHandlerService,
  AddUserProductHandlerService,
  UpdateUserProductHandlerService,
  DeleteUserProductHandlerService,
  InternalErrorHandlerService,
];

describe('UserProductsEffectsHandlerService', () => {
  const injectorMock: Injector = jasmine.createSpyObj('Injector', ['get']);
  let service: UserProductsEffectsHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Injector, useValue: injectorMock },
        {
          provide: GetUserProductsByDateHandlerService,
          useValue: {},
        },
        {
          provide: GetUserProductsByDateRangeHandlerService,
          useValue: {},
        },

        {
          provide: AddUserProductHandlerService,
          useValue: {},
        },
        {
          provide: UpdateUserProductHandlerService,
          useValue: {},
        },
        {
          provide: DeleteUserProductHandlerService,
          useValue: {},
        },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(UserProductsEffectsHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should test effect handlers creations', () => {
    actionsInput.forEach((action, index) => {
      service.createEffectHandler(action);
      expect(injectorMock.get).toHaveBeenCalledWith(expectedOutput[index]);
    });
  });
});
