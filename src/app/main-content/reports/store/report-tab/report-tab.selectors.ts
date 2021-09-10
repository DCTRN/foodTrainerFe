import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { ReportTab } from './report-tab.reducer';

export const reportTabKey = 'reportTab';

export const selectReportTabState = createFeatureSelector<AppState, ReportTab>(
  reportTabKey
);

export const selectSelectedChartType = createSelector(
  selectReportTabState,
  (state: ReportTab) => state.selectedChartType
);

export const selectCurrentTimeStampType = createSelector(
  selectReportTabState,
  (state: ReportTab) => state.timeStamp
);
