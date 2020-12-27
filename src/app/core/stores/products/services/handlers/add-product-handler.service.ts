import { Injectable } from '@angular/core';
import { ProductsApiService } from '@api/products/products-api.service';
import { Product } from '@core/models/products';
import { NotificationService } from '@core/notifications/service/notification.service';
import { EffectHandler } from '@core/stores/models/effect-handler.interface';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProductsAction } from '../../products.actions';

@Injectable({
  providedIn: 'root',
})
export class AddProductHandlerService implements EffectHandler {
  private readonly errorMessage = 'Failed to add product';

  constructor(
    private productsApiService: ProductsApiService,
    private notificationService: NotificationService
  ) {}

  public handle(action: { product: Product } & Action): Observable<Action> {
    return this.productsApiService.addProduct(action.product).pipe(
      map((p) => ProductsAction.ADD_PRODUCT_REQUEST_SUCCESS({ product: p })),
      catchError(() => this.errorHandler())
    );
  }

  private errorHandler(): Observable<Action> {
    this.notificationService.error(this.errorMessage);
    return of(ProductsAction.ADD_PRODUCT_REQUEST_ERROR());
  }
}
