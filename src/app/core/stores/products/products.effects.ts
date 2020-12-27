import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, TypedAction } from '@ngrx/store/src/models';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ProductsAction } from './products.actions';
import { ProductsEffectsHandlerService } from './services/products-effects-handler.service';

@Injectable()
export class ProductsEffects {
  public getAllUserProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsAction.GET_ALL_PRODUCTS_REQUEST),
      switchMap((action: TypedAction<string>) => this.handle(action))
    )
  );

  public addProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsAction.ADD_PRODUCT_REQUEST),
      switchMap((action: TypedAction<string>) => this.handle(action))
    )
  );

  public updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsAction.UPDATE_PRODUCT_REQUEST),
      switchMap((action: TypedAction<string>) => this.handle(action))
    )
  );

  public deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsAction.DELETE_PRODUCT_REQUEST),
      switchMap((action: TypedAction<string>) => this.handle(action))
    )
  );

  private readonly signature = '[PR.E]';

  constructor(
    private actions$: Actions,
    private logger: NGXLogger,
    private productsEffectsHandlerService: ProductsEffectsHandlerService
  ) {}

  private handle(action: TypedAction<string>): Observable<Action> {
    return this.productsEffectsHandlerService
      .createEffectHandler(action)
      .handle(action)
      .pipe(tap((a: TypedAction<string>) => this.log(a.type)));
  }

  private log(type: string): void {
    this.logger.log(`${this.signature} Handling ${type}`);
  }
}
