import { Injectable } from '@angular/core';
import { UserProductsApiService } from '@api/user-products/user-products-api.service';
import { UserProductDeletion } from '@core/models/user-products';
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
export class DeleteUserProductHandlerService implements EffectHandler {
  private readonly errorMassage = 'Failed to delete product';

  constructor(
    private userProductsApiService: UserProductsApiService,
    private notificationService: NotificationService,
    private store: Store<AppState>
  ) {}

  public handle(
    action: {
      userProductDeletion: Omit<UserProductDeletion, 'userId'>;
    } & Action
  ): Observable<Action> {
    return this.store
      .pipe(select('user'), take(1))
      .pipe(
        switchMap((user: User) => this.deleteUserProductRequest(user, action))
      );
  }

  private deleteUserProductRequest(
    user: User,
    action: {
      userProductDeletion: Omit<UserProductDeletion, 'userId'>;
    } & Action
  ): Observable<Action> {
    return this.userProductsApiService
      .deleteUserProduct(this.createProductDeletion(user, action))
      .pipe(
        map(() => this.createSuccessAction(action)),
        catchError(() => this.errorHandler())
      );
  }

  private createProductDeletion(
    user: User,
    action: {
      userProductDeletion: Omit<UserProductDeletion, 'userId'>;
    } & Action
  ): UserProductDeletion {
    return {
      userId: user.id,
      userProductId: action.userProductDeletion.userProductId,
    };
  }

  private createSuccessAction(
    action: {
      userProductDeletion: Omit<UserProductDeletion, 'userId'>;
    } & Action
  ): Action {
    return UserProductsAction.DELETE_USER_PRODUCT_REQUEST_SUCCESS({
      id: action.userProductDeletion.userProductId,
    });
  }

  private errorHandler(): Observable<Action> {
    this.notificationService.error(this.errorMassage);
    return of(UserProductsAction.DELETE_USER_PRODUCT_REQUEST_ERROR());
  }
}
