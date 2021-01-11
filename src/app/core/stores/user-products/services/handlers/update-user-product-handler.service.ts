import { Injectable } from '@angular/core';
import { UserProductsApiService } from '@api/user-products/user-products-api.service';
import {
  UserProduct,
  UserProductDTO,
  UserProductModification,
} from '@core/models/user-products';
import { NotificationService } from '@core/notifications/service/notification.service';
import { EffectHandler } from '@core/stores/models/effect-handler.interface';
import { User } from '@core/stores/user/user.model';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { UserProductsAction } from '../../user-products.actions';

@Injectable({
  providedIn: 'root',
})
export class UpdateUserProductHandlerService implements EffectHandler {
  private readonly errorMessage = 'Failed to update product';

  constructor(
    private store: Store<AppState>,
    private userProductsApiService: UserProductsApiService,
    private notificationService: NotificationService
  ) {}

  public handle(
    action: {
      userProductModification: Omit<UserProductModification, 'userId'>;
    } & Action
  ): Observable<Action> {
    return this.store
      .pipe(select('user'), take(1))
      .pipe(switchMap((user: User) => this.updateProduct(action, user)));
  }

  private updateProduct(
    action: {
      userProductModification: Omit<UserProductModification, 'userId'>;
    } & Action,
    user: User
  ): Observable<Action> {
    return this.userProductsApiService
      .updateUserProduct(this.createUserProductModification(action, user))
      .pipe(
        map((userProduct: UserProduct) =>
          this.createSuccessAction(userProduct)
        ),
        catchError(() => this.errorHandler())
      );
  }

  private createUserProductModification(
    action: {
      userProductModification: Omit<UserProductModification, 'userId'>;
    } & Action,
    user: User
  ): UserProductModification {
    const userId = user.id;
    return {
      userId,
      product: {
        ...action.userProductModification.product,
        userId,
      },
    };
  }

  private createSuccessAction(userProduct: UserProduct): Action {
    return UserProductsAction.UPDATE_USER_PRODUCT_REQUEST_SUCCESS({
      userProduct,
    });
  }

  private errorHandler(): Observable<Action> {
    this.notificationService.error(this.errorMessage);
    return of(UserProductsAction.UPDATE_USER_PRODUCT_REQUEST_ERROR());
  }
}
