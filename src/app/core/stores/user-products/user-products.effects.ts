import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, TypedAction } from '@ngrx/store/src/models';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { UserProductsEffectsHandlerService } from './services/user-products-effects-handler.service';
import { UserProductsAction } from './user-products.actions';

@Injectable()
export class UserProductsEffects {
  public getUserProductsByDate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserProductsAction.GET_USER_PRODUCTS_BY_DATE_REQUEST),
      switchMap((action: TypedAction<string>) => this.handle(action))
    )
  );

  public getUserProductsByDateRange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserProductsAction.GET_USER_PRODUCTS_BY_DATE_RANGE_REQUEST),
      switchMap((action: TypedAction<string>) => this.handle(action))
    )
  );

  public addUserProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserProductsAction.ADD_USER_PRODUCT_REQUEST),
      switchMap((action: TypedAction<string>) => this.handle(action))
    )
  );

  public updateUserProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserProductsAction.UPDATE_USER_PRODUCT_REQUEST),
      switchMap((action: TypedAction<string>) => this.handle(action))
    )
  );

  public deleteUserProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserProductsAction.DELETE_USER_PRODUCT_REQUEST),
      switchMap((action: TypedAction<string>) => this.handle(action))
    )
  );

  private readonly signature = '[UPR.E]';

  constructor(
    private actions$: Actions,
    private logger: NGXLogger,
    private userProductsEffectsHandlerService: UserProductsEffectsHandlerService
  ) {}

  private handle(action: TypedAction<string>): Observable<Action> {
    return this.userProductsEffectsHandlerService
      .createEffectHandler(action)
      .handle(action)
      .pipe(tap((a: TypedAction<string>) => this.log(a.type)));
  }

  private log(type: string): void {
    this.logger.log(`${this.signature} Handling ${type}`);
  }
}
