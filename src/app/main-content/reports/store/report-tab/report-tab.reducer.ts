import { ChartOptions } from '@main-content/reports/itf/chart-options';
import { TimeStamp } from '@main-content/reports/itf/time-stamp.model';
import { createReducer, on } from '@ngrx/store';
import { ReportTabActions } from './report-tab.actions';

export interface ReportTab {
  timeStamp: TimeStamp;
  selectedChartType: ChartOptions;
}

export const initialState: ReportTab = {
  timeStamp: TimeStamp.DAILY,
  selectedChartType: ChartOptions.PIE,
};

export const _reportTabReducer = createReducer(
  initialState,
  on(ReportTabActions.UPDATE_SELECTED_TIME_STAMP, (state, action) =>
    reduceTimeStampSelection(state, action)
  ),
  on(ReportTabActions.UPDATE_SELECTED_TIME_CHART_TYPE, (state, action) =>
    reduceSelectedChartTypeUpdate(state, action)
  )
);

function reduceSelectedChartTypeUpdate(state: ReportTab, action): ReportTab {
  return {
    ...state,
    selectedChartType: action.selectedChartType,
  };
}

function reduceTimeStampSelection(state: ReportTab, action): ReportTab {
  return {
    ...state,
    timeStamp: action.selectedTimeStamp,
  };
}

export function reportTabReducer(state, action) {
  return _reportTabReducer(state, action);
}
