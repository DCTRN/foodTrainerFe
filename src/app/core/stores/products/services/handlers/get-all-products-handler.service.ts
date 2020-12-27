import { Injectable } from '@angular/core';
import { ProductsApiService } from '@api/products/products-api.service';
import { Product } from '@core/models/products';
import { NotificationService } from '@core/notifications/service/notification.service';
import { User } from '@core/stores/user/user.model';
import { select, Store } from '@ngrx/store';
import { Action } from '@ngrx/store/src/models';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { EffectHandler } from '../../../models/effect-handler.interface';
import { ProductsAction } from '../../products.actions';

@Injectable({
  providedIn: 'root',
})
export class GetAllProductsHandlerService implements EffectHandler {
  private readonly errorMessage = 'Failed to fetch users products';

  constructor(
    private store: Store<AppState>,
    private productsApiService: ProductsApiService,
    private notificationService: NotificationService
  ) {}

  public handle(action?: Action): Observable<Action> {
    return this.store.pipe(select('user'), take(1)).pipe(
      switchMap((user: User) =>
        this.productsApiService.findProductsByUserId(user.id)
      ),
      map((products: Product[]) =>
        ProductsAction.GET_ALL_PRODUCTS_REQUEST_SUCCESS({ products })
      ),
      catchError(() => this.errorHandler())
    );
  }

  private errorHandler(): Observable<Action> {
    this.notificationService.error(this.errorMessage);
    return of(ProductsAction.GET_ALL_PRODUCTS_REQUEST_ERROR());
  }
}
