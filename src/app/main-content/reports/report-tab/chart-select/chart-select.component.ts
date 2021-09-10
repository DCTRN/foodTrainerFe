import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectData } from '@itf/mat-select-data.model';
import { TimeStamp } from '@main-content/reports/itf/time-stamp.model';
import { ReportTabActions } from '@main-content/reports/store/report-tab/report-tab.actions';
import * as ReportTabSelects from '@main-content/reports/store/report-tab/report-tab.selectors';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { ChartOptions } from '../../itf/chart-options';

export const dailyCharts: Array<MatSelectData<ChartOptions, string>> = [
  {
    value: ChartOptions.PIE,
    viewValue: 'Pie Chart',
  },
  {
    value: ChartOptions.BAR,
    viewValue: 'Bar Chart',
  },
  {
    value: ChartOptions.POLAR_AREA,
    viewValue: 'Polar Area Chart',
  },
];

export const weeklyCharts: Array<MatSelectData<ChartOptions, string>> = [
  {
    value: ChartOptions.PIE,
    viewValue: 'Pie Chart',
  },
  {
    value: ChartOptions.BAR,
    viewValue: 'Bar Chart',
  },
  {
    value: ChartOptions.POLAR_AREA,
    viewValue: 'Polar Area Chart',
  },
  {
    value: ChartOptions.LINE,
    viewValue: 'Line Chart',
  },
];

export const monthlyCharts: Array<MatSelectData<ChartOptions, string>> = [
  {
    value: ChartOptions.PIE,
    viewValue: 'Pie Chart',
  },
  {
    value: ChartOptions.BAR,
    viewValue: 'Bar Chart',
  },
  {
    value: ChartOptions.POLAR_AREA,
    viewValue: 'Polar Area Chart',
  },
];

@Component({
  selector: 'app-char-select',
  templateUrl: './chart-select.component.html',
  styleUrls: ['./chart-select.component.scss'],
})
export class CharSelectComponent implements OnInit, OnDestroy {
  public timeStamp: TimeStamp = TimeStamp.DAILY;

  private chartsPerTimeStamp: Record<
    number,
    Array<MatSelectData<ChartOptions, string>>
  > = {
    [TimeStamp.DAILY]: dailyCharts,
    [TimeStamp.WEEKLY]: weeklyCharts,
    [TimeStamp.MONTHLY]: monthlyCharts,
  };

  public charts: Array<MatSelectData<ChartOptions, string>>;
  public charSelect: FormControl;
  public selectedChart: ChartOptions = ChartOptions.PIE;

  private subscriptions = new Subscription();

  constructor(private store: Store<AppState>) {}

  public ngOnInit(): void {
    this.charts = this.chartsPerTimeStamp[TimeStamp.DAILY];
    this.selectedChart = this.charts[0].value;
    this.dispatchUpdateSelectedChartTypeAction(this.selectedChart);
    this.initializeComponent();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeComponent(): void {
    this.createSexFormControl();
    this.subscribeToFormChanges();
    this.subscribeToCurrentTimeStamp();
  }

  private subscribeToCurrentTimeStamp() {
    this.subscriptions.add(
      this.store
        .select(ReportTabSelects.selectCurrentTimeStampType)
        .pipe(distinctUntilChanged())
        .subscribe((currentTimeStamp: TimeStamp) =>
          this.updateChartOptions(currentTimeStamp)
        )
    );
  }

  private updateChartOptions(currentTimeStamp: TimeStamp) {
    this.charts = this.chartsPerTimeStamp[currentTimeStamp];
    this.selectedChart = this.charts[0].value;
    this.charSelect.setValue(this.selectedChart);
  }

  private subscribeToFormChanges(): void {
    this.subscriptions.add(
      this.charSelect.valueChanges
        .pipe(filter((selectedChart) => selectedChart !== this.selectedChart))
        .subscribe((chartSelect: ChartOptions) =>
          this.dispatchUpdateSelectedChartTypeAction(chartSelect)
        )
    );
  }

  private dispatchUpdateSelectedChartTypeAction(chartSelect: ChartOptions) {
    this.selectedChart = chartSelect;
    this.store.dispatch(this.createUpdateSelectedChartAction(chartSelect));
  }

  private createUpdateSelectedChartAction(chartSelect: ChartOptions) {
    return ReportTabActions.UPDATE_SELECTED_TIME_CHART_TYPE({
      selectedChartType: chartSelect,
    });
  }

  private createSexFormControl() {
    this.charSelect = new FormControl('');
    this.charSelect.setValue(this.selectedChart);
  }
}
