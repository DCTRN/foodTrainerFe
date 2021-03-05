import { Injectable } from '@angular/core';
import { UserProductsApiService } from '@api/user-products/user-products-api.service';
import { UserProduct, UserProductDTO } from '@core/models/user-products';
import { NotificationService } from '@core/notifications/service/notification.service';
import { EffectHandler } from '@core/stores/models/effect-handler.interface';
import { User } from '@core/stores/user/user.model';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { UserProductsAction } from '../../user-products.actions';

@Injectable({
  providedIn: 'root',
})
export class AddUserProductHandlerService implements EffectHandler {
  private readonly successMessage = 'Successfully added product';
  private readonly errorMessage = 'Failed to add product';

  constructor(
    private store: Store<AppState>,
    private userProductsApiService: UserProductsApiService,
    private notificationService: NotificationService
  ) {}

  public handle(
    action: { userProduct: Omit<UserProductDTO, 'userId'> } & Action
  ): Observable<Action> {
    return this.store
      .pipe(select('user'), take(1))
      .pipe(switchMap((user: User) => this.addProduct(action, user)));
  }

  private addProduct(
    action: { userProduct: Omit<UserProductDTO, 'userId'> } & Action,
    user: User
  ): Observable<Action> {
    return this.userProductsApiService
      .addUserProduct(this.createUserProduct(action, user))
      .pipe(
        map((userProduct: UserProduct) =>
          this.createSuccessAction(userProduct)
        ),
        tap(() => this.notificationService.success(this.successMessage)),
        catchError(() => this.errorHandler())
      );
  }

  private createUserProduct(
    action: { userProduct: Omit<UserProductDTO, 'userId'> } & Action,
    user: User
  ): UserProductDTO {
    return { ...action.userProduct, userId: user.id };
  }

  private createSuccessAction(userProduct: UserProduct): Action {
    return UserProductsAction.ADD_USER_PRODUCT_REQUEST_SUCCESS({
      userProduct,
    });
  }

  private errorHandler(): Observable<Action> {
    this.notificationService.error(this.errorMessage);
    return of(UserProductsAction.ADD_USER_PRODUCT_REQUEST_ERROR());
  }
}
