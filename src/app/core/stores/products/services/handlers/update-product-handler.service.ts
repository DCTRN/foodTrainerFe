import { Injectable } from '@angular/core';
import { ProductsApiService } from '@api/products/products-api.service';
import { Product, ProductModification } from '@core/models/products';
import { NotificationService } from '@core/notifications/service/notification.service';
import { EffectHandler } from '@core/stores/models/effect-handler.interface';
import { User } from '@core/stores/user/user.model';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { ProductsAction } from '../../products.actions';

@Injectable({
  providedIn: 'root',
})
export class UpdateProductHandlerService implements EffectHandler {
  private readonly errorMessage = 'Failed to update product';
  private readonly successMessage = 'Product updated successfully';

  constructor(
    private store: Store<AppState>,
    private productsApiService: ProductsApiService,
    private notificationService: NotificationService
  ) {}

  public handle(action: { product: Product } & Action): Observable<Action> {
    return this.store.pipe(select('user'), take(1)).pipe(
      switchMap((user: User) =>
        this.productsApiService
          .updateProduct(this.createProductModification(user, action))
          .pipe(
            map((p: Product) =>
              ProductsAction.UPDATE_PRODUCT_REQUEST_SUCCESS({ product: p })
            ),
            tap(() => this.notificationService.success(this.successMessage)),
            catchError(() => this.errorHandler())
          )
      )
    );
  }

  private createProductModification(
    user: User,
    action: { product: Product } & Action
  ): ProductModification {
    return {
      userId: user.id,
      product: action.product,
    };
  }

  private errorHandler(): Observable<Action> {
    this.notificationService.error(this.errorMessage);
    return of(ProductsAction.UPDATE_PRODUCT_REQUEST_ERROR());
  }
}
