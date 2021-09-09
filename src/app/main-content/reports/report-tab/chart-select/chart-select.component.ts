import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectData } from '@itf/mat-select-data.model';
import { TimeStamp } from '@main-content/reports/itf/time-stamp.model';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/reducers';
import { ChartOptions } from '../../itf/chart-options';

export const dailyCharts: Array<MatSelectData<ChartOptions, string>> = [
  {
    value: ChartOptions.BAR,
    viewValue: 'Bar Chart',
  },
  {
    value: ChartOptions.PIE,
    viewValue: 'Pie Chart',
  },
];

export const weeklyCharts: Array<MatSelectData<ChartOptions, string>> = [
  {
    value: ChartOptions.LINE,
    viewValue: 'Line Chart',
  },
  {
    value: ChartOptions.BAR,
    viewValue: 'Bar Chart',
  },
  {
    value: ChartOptions.DOUGHNUT,
    viewValue: 'Doughnut Chart',
  },
  {
    value: ChartOptions.PIE,
    viewValue: 'Pie Chart',
  },
];

export const monthlyCharts: Array<MatSelectData<ChartOptions, string>> = [
  {
    value: ChartOptions.LINE,
    viewValue: 'Line Chart',
  },
  {
    value: ChartOptions.BAR,
    viewValue: 'Bar Chart',
  },
  {
    value: ChartOptions.DOUGHNUT,
    viewValue: 'Doughnut Chart',
  },
  {
    value: ChartOptions.PIE,
    viewValue: 'Pie Chart',
  },
];

@Component({
  selector: 'app-char-select',
  templateUrl: './chart-select.component.html',
  styleUrls: ['./chart-select.component.scss'],
})
export class CharSelectComponent implements OnInit, OnDestroy {
  @Input()
  public timeStamp: TimeStamp = TimeStamp.DAILY;

  @Output()
  public chartSelectChange: EventEmitter<ChartOptions> = new EventEmitter<ChartOptions>();

  public kcal: number;

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
  public selectedChart: ChartOptions;

  private subscriptions = new Subscription();

  constructor(private store: Store<AppState>) {}

  public ngOnInit(): void {
    this.charts = this.chartsPerTimeStamp[this.timeStamp];
    this.selectedChart = this.charts[0].value;
    this.chartSelectChange.emit(this.selectedChart);
    this.initializeComponent();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeComponent(): void {
    this.createSexFormControl();
    this.subscribeToFormChanges();
  }

  private subscribeToFormChanges(): void {
    this.subscriptions.add(
      this.charSelect.valueChanges.subscribe((chartSelect: ChartOptions) => {
        this.chartSelectChange.emit(chartSelect);
      })
    );
  }

  private createSexFormControl() {
    this.charSelect = new FormControl('');
    this.charSelect.setValue(this.selectedChart);
  }
}
