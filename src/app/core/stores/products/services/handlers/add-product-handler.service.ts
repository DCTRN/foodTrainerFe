import { Injectable } from '@angular/core';
import { ProductsApiService } from '@api/products/products-api.service';
import { Product } from '@core/models/products';
import { NotificationService } from '@core/notifications/service/notification.service';
import { EffectHandler } from '@core/stores/models/effect-handler.interface';
import { User } from '@core/stores/user/user.model';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { ProductsAction } from '../../products.actions';
import { cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class AddProductHandlerService implements EffectHandler {
  private readonly errorMessage = 'Failed to add product';
  private readonly successMessage = 'Successfully created new product';

  constructor(
    private store: Store<AppState>,
    private productsApiService: ProductsApiService,
    private notificationService: NotificationService
  ) {}

  public handle(action: { product: Product } & Action): Observable<Action> {
    return this.store.pipe(select('user'), take(1)).pipe(
      switchMap((user: User) =>
        of(user).pipe(
          map(() => cloneDeep(action.product)),
          tap((p: Product) => (p.creatorId = user.id))
        )
      ),
      switchMap((product: Product) =>
        this.productsApiService.addProduct(product).pipe(
          map(() => ProductsAction.ADD_PRODUCT_REQUEST_SUCCESS({ product })),
          tap(() => this.successHandler()),
          catchError(() => this.errorHandler())
        )
      )
    );
  }

  private successHandler(): void {
    return this.notificationService.success(this.successMessage);
  }

  private errorHandler(): Observable<Action> {
    this.notificationService.error(this.errorMessage);
    return of(ProductsAction.ADD_PRODUCT_REQUEST_ERROR());
  }
}
