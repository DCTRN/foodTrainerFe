import { getTestBed, TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { of } from 'rxjs';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { EffectFactory } from '../models/effect-factory.interface';
import { EffectHandler } from '../models/effect-handler.interface';
import { UserProductsEffectsHandlerService } from './services/user-products-effects-handler.service';
import { UserProductsAction } from './user-products.actions';
import { UserProductsEffects } from './user-products.effects';

const input: Action[] = [
  UserProductsAction.GET_USER_PRODUCTS_BY_DATE_REQUEST,
  UserProductsAction.GET_USER_PRODUCTS_BY_DATE_RANGE_REQUEST,
  UserProductsAction.ADD_USER_PRODUCT_REQUEST,
  UserProductsAction.UPDATE_USER_PRODUCT_REQUEST,
  UserProductsAction.DELETE_USER_PRODUCT_REQUEST,
];

export class UserProductsEffectsHandlerServiceMock implements EffectFactory {
  public createEffectHandler(action: TypedAction<string>): EffectHandler {
    return { handle: () => of({ type: undefined }) };
  }
}

describe('UserProductsEffects', () => {
  let injector: TestBed;
  let actions$ = new ReplaySubject(1);
  let service: UserProductsEffects;
  let userProductsEffectsHandlerService: UserProductsEffectsHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoggerTestingModule],
      providers: [
        UserProductsEffects,
        provideMockActions(() => actions$),
        {
          provide: UserProductsEffectsHandlerService,
          useClass: UserProductsEffectsHandlerServiceMock,
        },
      ],
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    userProductsEffectsHandlerService = injector.inject(
      UserProductsEffectsHandlerService
    );
    service = injector.inject(UserProductsEffects);
    service.getUserProductsByDate$.subscribe();
    service.getUserProductsByDateRange$.subscribe();
    service.addUserProduct$.subscribe();
    service.updateUserProduct$.subscribe();
    service.deleteUserProduct$.subscribe();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should test action effects', () => {
    spyOn(
      userProductsEffectsHandlerService,
      'createEffectHandler'
    ).and.callThrough();
    input.forEach((action: Action) => {
      actions$.next(action);
      expect(
        userProductsEffectsHandlerService.createEffectHandler
      ).toHaveBeenCalledWith(action);
    });
  });
});
