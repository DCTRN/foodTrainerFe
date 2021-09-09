import { ChartOptions } from '@main-content/reports/itf/chart-options';
import { TimeStamp } from '@main-content/reports/itf/time-stamp.model';
import { createAction, props } from '@ngrx/store';

export const updateSelectedTimeStampType =
  '[REPORT_TAB] UPDATE_SELECTED_TIME_STAMP';
export const updateSelectedChartTypeType =
  '[REPORT_TAB] UPDATE_SELECTED_TIME_CHART_TYPE';

export const updateSelectedTimeStamp = createAction(
  updateSelectedTimeStampType,
  props<{ selectedTimeStamp: TimeStamp }>()
);
export const updateSelectedChartType = createAction(
  updateSelectedChartTypeType,
  props<{ selectedChartType: ChartOptions }>()
);

export const ReportTabTypes = {
  // GET USER PRODUCTS BY DATE TYPE
  UPDATE_SELECTED_TIME_STAMP: updateSelectedTimeStampType,
  UPDATE_SELECTED_TIME_CHART_TYPE: updateSelectedTimeStampType,
};

export const ReportTabActions = {
  UPDATE_SELECTED_TIME_STAMP: updateSelectedTimeStamp,
  UPDATE_SELECTED_TIME_CHART_TYPE: updateSelectedChartType,
};
