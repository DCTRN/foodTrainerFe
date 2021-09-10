import { UserProduct } from '@core/models/user-products/user-product.model';
import {
  createUserProductsNutritions,
  reduceUserProductsNutritions,
} from '@core/util-functions/util-functions';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { addHours, isWithinInterval, parseISO } from 'date-fns';
import { AppState } from 'src/app/reducers';
import { UserProducts } from './user-products.actions';

export interface DateRange {
  start: Date;
  end: Date;
}

export const userProductsKey = 'userProducts';

export const selectUserProductsState = createFeatureSelector<
  AppState,
  UserProducts
>(userProductsKey);

export const selectUserProducts = createSelector(
  selectUserProductsState,
  (state: UserProducts) => state.userProducts
);

export const selectUserProductsByDateRange = createSelector(
  selectUserProducts,
  (state: UserProduct[], props: DateRange) =>
    state.filter((up: UserProduct) =>
      isWithinInterval(parseISO(up.date as unknown as string), {
        start: props.start,
        end: props.end,
      })
    )
);

export const selectUserProductsKcalByDateRange = createSelector(
  selectUserProducts,
  (state: UserProduct[], props: DateRange) => {
    const filteredUserProducts = state.filter((up: UserProduct) =>
      isWithinInterval(parseISO(up.date as unknown as string), {
        start: props.start,
        end: props.end,
      })
    );
    return reduceUserProductsNutritions(filteredUserProducts).kcal;
  }
);

export const selectReducedUserProductsNutritionsByDateRange = createSelector(
  selectUserProducts,
  (state: UserProduct[], props: DateRange) => {
    const filteredUserProducts = state.filter((up: UserProduct) =>
      isWithinInterval(parseISO(up.date as unknown as string), {
        start: props.start,
        end: props.end,
      })
    );
    return reduceUserProductsNutritions(filteredUserProducts);
  }
);

export const selectAccumulatedUserProductsNutritionsByDateRangeForWeek =
  createSelector(
    selectUserProducts,
    (state: UserProduct[], props: DateRange) => {
      const filteredUserProducts = state.filter((up: UserProduct) =>
        isWithinInterval(parseISO(up.date as unknown as string), {
          start: props.start,
          end: props.end,
        })
      );
      const result = [];
      const userProductsToReduce = [[], [], [], [], [], [], []];
      filteredUserProducts.forEach((up: UserProduct) => {
        const calculatedDay = addHours(new Date(up.date), -2);
        const day = calculatedDay.getDay();
        const index = day === 0 ? 6 : day - 1;
        userProductsToReduce[index].push(up);
      });
      userProductsToReduce.forEach((ups: UserProduct[]) =>
        result.push(reduceUserProductsNutritions(ups))
      );
      return result;
    }
  );

export const selectUserProductsNutritionsByDateRange = createSelector(
  selectUserProducts,
  (state: UserProduct[], props: DateRange) => {
    const filteredUserProducts = state.filter((up: UserProduct) =>
      isWithinInterval(parseISO(up.date as unknown as string), {
        start: props.start,
        end: props.end,
      })
    );
    return createUserProductsNutritions(filteredUserProducts);
  }
);
