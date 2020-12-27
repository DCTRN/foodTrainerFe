import { Injectable, Injector, Type } from '@angular/core';
import { ProductsActionType } from '@core/stores/products/products.actions';
import { TypedAction } from '@ngrx/store/src/models';
import { EffectFactory } from '../../models/effect-factory.interface';
import { EffectHandler } from '../../models/effect-handler.interface';
import { AddProductHandlerService } from './handlers/add-product-handler.service';
import { DeleteProductHandlerService } from './handlers/delete-product-handler.service';
import { GetAllProductsHandlerService } from './handlers/get-all-products-handler.service';
import { InternalErrorHandlerService } from './handlers/internal-error-handler.service';
import { UpdateProductHandlerService } from './handlers/update-product-handler.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsEffectsHandlerService implements EffectFactory {
  private actionHandlers: { [key: string]: Type<EffectHandler> } = {
    [ProductsActionType.GET_ALL_PRODUCTS_REQUEST]: GetAllProductsHandlerService,
    [ProductsActionType.ADD_PRODUCT_REQUEST]: AddProductHandlerService,
    [ProductsActionType.UPDATE_PRODUCT_REQUEST]: UpdateProductHandlerService,
    [ProductsActionType.DELETE_PRODUCT_REQUEST]: DeleteProductHandlerService,
  };
  private internalErrorHandlerService: Type<EffectHandler> = InternalErrorHandlerService;

  constructor(private injector: Injector) {}

  public createEffectHandler(action: TypedAction<string>): EffectHandler {
    const token: Type<EffectHandler> =
      this.actionHandlers[action.type] || this.internalErrorHandlerService;
    const serviceToken = this.injector.get(token);
    return serviceToken;
  }
}
