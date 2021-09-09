import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { ReportTab } from './report-tab.reducer';

export const reportTabKey = 'reportTab';

export const selectUserProductsState = createFeatureSelector<
  AppState,
  ReportTab
>(reportTabKey);

export const selectUserProducts = createSelector(
  selectUserProductsState,
  (state: ReportTab) => state.userProducts
);
