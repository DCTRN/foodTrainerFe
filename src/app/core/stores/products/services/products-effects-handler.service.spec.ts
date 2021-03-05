import { Injector, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { EffectHandler } from '@core/stores/models/effect-handler.interface';
import { Action } from '@ngrx/store';
import { ProductsAction } from '../products.actions';
import { AddProductHandlerService } from './handlers/add-product-handler.service';
import { DeleteProductHandlerService } from './handlers/delete-product-handler.service';
import { GetAllProductsHandlerService } from './handlers/get-all-products-handler.service';
import { InternalErrorHandlerService } from '../../common/internal-error-handler.service';
import { UpdateProductHandlerService } from './handlers/update-product-handler.service';
import { ProductsEffectsHandlerService } from './products-effects-handler.service';

const actionsInput: Action[] = [
  ProductsAction.GET_ALL_PRODUCTS_REQUEST,
  ProductsAction.ADD_PRODUCT_REQUEST,
  ProductsAction.UPDATE_PRODUCT_REQUEST,
  ProductsAction.DELETE_PRODUCT_REQUEST,
  ProductsAction.DELETE_PRODUCT_REQUEST_ERROR,
];

const expectedOutput: Type<EffectHandler>[] = [
  GetAllProductsHandlerService,
  AddProductHandlerService,
  UpdateProductHandlerService,
  DeleteProductHandlerService,
  InternalErrorHandlerService,
];

describe('ProductsEffectsHandlerService', () => {
  let injector: TestBed;
  let service: ProductsEffectsHandlerService;
  const injectorMock: Injector = jasmine.createSpyObj('Injector', ['get']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductsEffectsHandlerService,
        {
          provide: Injector,
          useValue: injectorMock,
        },
        {
          provide: GetAllProductsHandlerService,
          useValue: {},
        },
        {
          provide: AddProductHandlerService,
          useValue: {},
        },

        {
          provide: UpdateProductHandlerService,
          useValue: {},
        },
        {
          provide: DeleteProductHandlerService,
          useValue: {},
        },
      ],
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    service = injector.inject(ProductsEffectsHandlerService);
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
