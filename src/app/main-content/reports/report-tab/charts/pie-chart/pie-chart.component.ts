import { Component, Input, OnInit } from '@angular/core';
import { ProductNutritions } from '@core/models/products/product-nutritions.interface';
import {
  setBeginningOfTheDay,
  setEndOfTheDay,
} from '@core/util-functions/util-functions';
import { TimeStamp } from '@main-content/reports/itf/time-stamp.model';
import { Store } from '@ngrx/store';
import * as fromUserProducts from '@stores/user-products/user-products.selectors';
import { ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns';
import { Label } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/reducers';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit {
  @Input()
  public timeStamp: TimeStamp = TimeStamp.MONTHLY;
  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    },
  };
  public pieChartLabels: Label[] = [['Protein'], ['Carbs'], ['Fats']];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: [
        'rgba(255,0,0,0.3)',
        'rgba(0,255,0,0.3)',
        'rgba(0,0,255,0.3)',
      ],
    },
  ];

  private dateRanges: Record<number, fromUserProducts.DateRange> = {
    [TimeStamp.DAILY]: {
      start: setBeginningOfTheDay(new Date()),
      end: setEndOfTheDay(new Date()),
    },
    [TimeStamp.WEEKLY]: {
      start: startOfWeek(new Date(), { weekStartsOn: 1 }),
      end: endOfWeek(new Date(), { weekStartsOn: 1 }),
    },
    [TimeStamp.MONTHLY]: {
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date()),
    },
  };

  private subscription = new Subscription();

  constructor(private store: Store<AppState>) {}

  public ngOnInit(): void {
    this.subscription.add(
      this.store
        .select(
          fromUserProducts.selectUserProductsNutritionsByDateRange,
          this.dateRanges[this.timeStamp]
        )
        .pipe()
        .subscribe(
          (nutritions: ProductNutritions) =>
            (this.pieChartData = [
              nutritions.protein | 0,
              nutritions.carbohydrates | 0,
              nutritions.fats | 0,
            ])
        )
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
