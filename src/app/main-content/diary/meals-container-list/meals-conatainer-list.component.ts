import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Product, ProductWrapperDisplayType } from '@core/models/products';
import { MealEatTimeType, UserProduct } from '@core/models/user-products';
import { UserProducts } from '@core/stores/user-products/user-products.actions';
import {
  convertToPrecision,
  calculateShare,
} from '@core/util-functions/util-functions';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { MealContainerAction } from '../meals-container/meals-container.component';

@Component({
  selector: 'app-meals-conatainer-list',
  templateUrl: './meals-conatainer-list.component.html',
  styleUrls: ['./meals-conatainer-list.component.scss'],
})
export class MealsConatainerListComponent implements OnInit {
  @Output()
  public action: EventEmitter<MealContainerAction> = new EventEmitter<MealContainerAction>();

  public display = ProductWrapperDisplayType.DIARY_SUMMARY;
  public mealEatTimeType = MealEatTimeType;

  public product: Partial<Product> = {
    kcal: 0,
    protein: 0,
    carbohydrates: 0,
    fats: 0,
  };
  public columns: string[] = ['protein', 'carbohydrates', 'fats', 'kcal'];

  constructor(private store: Store<AppState>) {}

  public ngOnInit(): void {
    this.store
      .pipe(
        select('userProducts'),
        map((userProducts: UserProducts) => userProducts.userProducts)
      )
      .subscribe((userProducts: UserProduct[]) =>
        this.updateDisplayedProductsSummary(userProducts)
      );
  }

  public onAction(action: MealContainerAction): void {
    this.action.emit(action);
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
}
