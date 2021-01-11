import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  ButtonAction,
  Product,
  ProductWrapperDisplayType,
} from '@core/models/products';
import { DiaryAction } from '@core/models/products/diary-action.interface';
import { MealEatTimeType, UserProduct } from '@core/models/user-products';
import {
  UserProducts,
  UserProductsAction,
} from '@core/stores/user-products/user-products.actions';
import {
  calculateShare,
  convertToPrecision,
} from '@core/util-functions/util-functions';
import { Action } from '@ngrx/store';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';

export interface MealContainerAction {
  action: ButtonAction;
  mealEatTimeType: MealEatTimeType;
}

@Component({
  selector: 'app-meals-container',
  templateUrl: './meals-container.component.html',
  styleUrls: ['./meals-container.component.scss'],
})
export class MealsContainerComponent implements OnInit, OnDestroy {
  @Input()
  public mealEatTimeType: MealEatTimeType;

  @Input()
  public title: string;

  @Output()
  public action: EventEmitter<MealContainerAction> = new EventEmitter<MealContainerAction>();

  public display = ProductWrapperDisplayType.DIARY_SUMMARY;
  public columns: string[] = ['protein', 'carbohydrates', 'fats', 'kcal'];
  public userProducts: UserProduct[] = [];
  public product: Partial<Product> = {};

  private subscriptions = new Subscription();
  private readonly handlers: {
    [key: string]: (action: DiaryAction) => void;
  } = {
    [ButtonAction.UPDATE]: (action: DiaryAction) => {
      this.updateHandler(action);
    },
    [ButtonAction.DELETE]: (action: DiaryAction) => {
      this.deleteHandler(action);
    },
  };

  constructor(private store: Store<AppState>) {}

  public ngOnInit(): void {
    this.subscribeToUserProducts();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onDiaryAction(action: DiaryAction): void {
    this.handlers[action.action](action);
  }

  public onAddClick(): void {
    this.addHandler();
  }

  private addHandler(): void {
    this.action.emit({
      action: ButtonAction.ADD,
      mealEatTimeType: this.mealEatTimeType,
    });
  }

  private deleteHandler(diaryAction: DiaryAction): void {
    this.store.dispatch(this.createDeleteAction(diaryAction));
  }

  private createDeleteAction(diaryAction: DiaryAction): Action {
    return UserProductsAction.DELETE_USER_PRODUCT_REQUEST({
      userProductDeletion: { userProductId: diaryAction.userProduct.id },
    });
  }

  private updateHandler(diaryAction: DiaryAction): void {
    this.store.dispatch(this.createUpdateAction(diaryAction));
  }

  private createUpdateAction(diaryAction: DiaryAction): Action {
    return UserProductsAction.UPDATE_USER_PRODUCT_REQUEST({
      userProductModification: {
        product: {
          ...diaryAction.userProduct,
          productId: diaryAction.userProduct.product.id,
        },
      },
    });
  }

  private subscribeToUserProducts(): void {
    const subscription = this.store
      .pipe(
        select('userProducts'),
        map((userProducts: UserProducts) => userProducts?.userProducts || []),
        map((userProducts: UserProduct[]) =>
          this.filterUserProductsByMealEatTime(userProducts)
        ),
        tap((userProducts: UserProduct[]) => {
          this.updateDisplayedProductsSummary(userProducts);
        })
      )
      .subscribe(
        (userProducts: UserProduct[]) => (this.userProducts = userProducts)
      );
    this.subscriptions.add(subscription);
  }

  private updateDisplayedProductsSummary(userProducts: UserProduct[]): void {
    this.columns.forEach(
      (key: string) =>
        (this.product[key] = userProducts.reduce(
          (p, c) => convertToPrecision((p += this.reducePropertyBy(c, key))),
          0
        ))
    );
  }

  private reducePropertyBy(c: UserProduct, key: string): number {
    return convertToPrecision(
      calculateShare(c.amount, c.product.amount) * c.product[key]
    );
  }

  private filterUserProductsByMealEatTime(
    userProducts: UserProduct[]
  ): UserProduct[] {
    return userProducts.filter(
      (userProduct: UserProduct) =>
        userProduct.mealTimeType === this.mealEatTimeType
    );
  }
}
