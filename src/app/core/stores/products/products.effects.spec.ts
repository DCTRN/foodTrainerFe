import { getTestBed, TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { of } from 'rxjs';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { EffectFactory } from '../models/effect-factory.interface';
import { EffectHandler } from '../models/effect-handler.interface';
import { ProductsAction } from './products.actions';
import { ProductsEffects } from './products.effects';
import { ProductsEffectsHandlerService } from './services/products-effects-handler.service';

const input: Action[] = [
  ProductsAction.GET_ALL_PRODUCTS_REQUEST,
  ProductsAction.ADD_PRODUCT_REQUEST,
  ProductsAction.UPDATE_PRODUCT_REQUEST,
  ProductsAction.DELETE_PRODUCT_REQUEST,
];

export class ProductsEffectsHandlerServiceMock implements EffectFactory {
  public createEffectHandler(action: TypedAction<string>): EffectHandler {
    return { handle: () => of({ type: undefined }) };
  }
}

describe('FriendsEffects', () => {
  let injector: TestBed;
  let actions$ = new ReplaySubject(1);
  let service: ProductsEffects;
  let productsEffectsHandlerService: ProductsEffectsHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoggerTestingModule],
      providers: [
        ProductsEffects,
        provideMockActions(() => actions$),
        {
          provide: ProductsEffectsHandlerService,
          useClass: ProductsEffectsHandlerServiceMock,
        },
      ],
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    productsEffectsHandlerService = injector.inject(
      ProductsEffectsHandlerService
    );
    service = injector.inject(ProductsEffects);
    service.getAllUserProducts$.subscribe();
    service.addProduct$.subscribe();
    service.updateProduct$.subscribe();
    service.deleteProduct$.subscribe();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should test action effects', () => {
    spyOn(
      productsEffectsHandlerService,
      'createEffectHandler'
    ).and.callThrough();
    input.forEach((action: Action) => {
      actions$.next(action);
      expect(
        productsEffectsHandlerService.createEffectHandler
      ).toHaveBeenCalledWith(action);
    });
  });
});
