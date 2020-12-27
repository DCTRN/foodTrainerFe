import { Injectable } from '@angular/core';
import { ProductsApiService } from '@api/products/products-api.service';
import { NotificationService } from '@core/notifications/service/notification.service';
import { EffectHandler } from '@core/stores/models/effect-handler.interface';
import { User } from '@core/stores/user/user.model';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { ProductsAction } from '../../products.actions';

@Injectable({
  providedIn: 'root',
})
export class DeleteProductHandlerService implements EffectHandler {
  constructor(
    private store: Store<AppState>,
    private productsApiService: ProductsApiService,
    private notificationService: NotificationService
  ) {}

  private readonly errorMessage = 'Failed to delete product';

  public handle(action: { id: number } & Action): Observable<Action> {
    return this.store.pipe(select('user'), take(1)).pipe(
      switchMap((user: User) =>
        this.productsApiService.deleteProduct({
          userId: user.id,
          productId: action.id,
        })
      ),
      map(() =>
        ProductsAction.DELETE_PRODUCT_REQUEST_SUCCESS({ id: action.id })
      ),
      catchError(() => this.errorHandler())
    );
  }

  private errorHandler(): Observable<Action> {
    this.notificationService.error(this.errorMessage);
    return of(ProductsAction.DELETE_PRODUCT_REQUEST_ERROR());
  }
}
