import { MatTabChangeEvent } from '@angular/material/tabs';
import { ChartOptions } from '@main-content/reports/itf/chart-options';
import { TimeStamp } from '@main-content/reports/itf/time-stamp.model';
import { ReportTabActions } from '@main-content/reports/store/report-tab/report-tab.actions';
import { ReportTab } from '@main-content/reports/store/report-tab/report-tab.reducer';

export const initialReportTabState: { reportTab: ReportTab } = {
  reportTab: {
    timeStamp: TimeStamp.DAILY,
    selectedChartType: ChartOptions.PIE,
  },
};

export const updateTimeStampDaily = ReportTabActions.UPDATE_SELECTED_TIME_STAMP(
  {
    selectedTimeStamp: TimeStamp.DAILY,
  }
);

export const updateTimeStampWeekly =
  ReportTabActions.UPDATE_SELECTED_TIME_STAMP({
    selectedTimeStamp: TimeStamp.WEEKLY,
  });

export const updateTimeStampMonthly =
  ReportTabActions.UPDATE_SELECTED_TIME_STAMP({
    selectedTimeStamp: TimeStamp.MONTHLY,
  });

export const matTabEvent1: MatTabChangeEvent = {
  index: 0,
  tab: undefined,
};

export const matTabEvent2: MatTabChangeEvent = {
  index: 1,
  tab: undefined,
};

export const matTabEvent3: MatTabChangeEvent = {
  index: 2,
  tab: undefined,
};
