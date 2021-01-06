import { Injectable } from '@angular/core';
import { UserProductsApiService } from '@api/user-products/user-products-api.service';
import {
  UserProduct,
  UserProductsByDateRange,
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
export class GetUserProductsByDateRangeHandlerService implements EffectHandler {
  private readonly errorMassage = 'Failed to fetch products';

  constructor(
    private store: Store<AppState>,
    private userProductsApiService: UserProductsApiService,
    private notificationService: NotificationService
  ) {}

  public handle(
    action: { userProductsBy: Omit<UserProductsByDateRange, 'userId'> } & Action
  ): Observable<Action> {
    return this.store
      .pipe(select('user'), take(1))
      .pipe(
        switchMap((user: User) => this.fetchUserProductsByDate(user, action))
      );
  }

  private fetchUserProductsByDate(
    user: User,
    action: { userProductsBy: Omit<UserProductsByDateRange, 'userId'> } & Action
  ): Observable<Action> {
    return this.userProductsApiService
      .findUserProductsByDateRange(
        this.createFindProductsByObject(user, action)
      )
      .pipe(
        map((userProducts: UserProduct[]) =>
          this.createSuccessAction(userProducts)
        ),
        catchError(() => this.errorHandler())
      );
  }

  private createFindProductsByObject(
    user: User,
    action: { userProductsBy: Omit<UserProductsByDateRange, 'userId'> } & Action
  ): UserProductsByDateRange {
    return {
      userId: user.id,
      start: action.userProductsBy.start,
      end: action.userProductsBy.end,
    };
  }

  private createSuccessAction(userProducts: UserProduct[]): Action {
    return UserProductsAction.GET_USER_PRODUCTS_BY_DATE_RANGE_REQUEST_SUCCESS({
      userProducts,
    });
  }

  private errorHandler(): Observable<Action> {
    this.notificationService.error(this.errorMassage);
    return of(UserProductsAction.GET_USER_PRODUCTS_BY_DATE_RANGE_REQUEST_ERROR());
  }
}
