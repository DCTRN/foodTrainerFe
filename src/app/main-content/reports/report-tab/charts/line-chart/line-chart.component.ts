import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ProductNutritions } from '@core/models/products/product-nutritions.interface';
import {
  setBeginningOfTheDay,
  setEndOfTheDay,
} from '@core/util-functions/util-functions';
import { TimeStamp } from '@main-content/reports/itf/time-stamp.model';
import { Store } from '@ngrx/store';
import * as fromUserProducts from '@stores/user-products/user-products.selectors';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns';
import { BaseChartDirective, Color, Label } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit {
  @Input()
  public timeStamp: TimeStamp = TimeStamp.MONTHLY;
  public lineChartData: ChartDataSets[] = [
    {
      data: [],
      label: 'Protein',
    },
    {
      data: [],
      label: 'Carbs',
    },
    {
      data: [],
      label: 'Fats',
      yAxisID: 'y-axis-1',
    },
  ];
  public lineChartLabels: Label[] = ['1', '2', '3', '4', '5', '6', '7'];
  public lineChartOptions: ChartOptions & { annotation: any } = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          },
        },
      ],
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno',
          },
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    {
      // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    },
    {
      // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)',
    },
    {
      // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective, { static: true })
  public chart: BaseChartDirective;

  public shouldDisplayChart = false;

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
    this.subscribeToProductNutritionData();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private subscribeToProductNutritionData(): void {
    this.subscription.add(
      this.store
        .select(
          fromUserProducts.selectUserProductsNutritionsByDateRange,
          this.dateRanges[this.timeStamp]
        )
        .pipe(
          tap((nutritions: Array<ProductNutritions>) =>
            this.evaluateIfShouldDisplayChart(nutritions)
          )
        )
        .subscribe((nutritions: Array<ProductNutritions>) =>
          this.updateDisplayedData(nutritions)
        )
    );
  }

  private evaluateIfShouldDisplayChart(nutritions: ProductNutritions[]) {
    if (nutritions.length) {
      this.shouldDisplayChart = true;
    } else {
      this.shouldDisplayChart = false;
    }
  }

  private updateDisplayedData(nutritions: Array<ProductNutritions>): void {
    this.resetLineCharData();
    for (let i = 0; i < this.lineChartLabels.length; i++) {
      this.lineChartData[0].data.push(nutritions?.[i]?.protein | 0);
      this.lineChartData[1].data.push(nutritions?.[i]?.carbohydrates | 0);
      this.lineChartData[2].data.push(nutritions?.[i]?.fats | 0);
    }
  }

  private resetLineCharData(): void {
    this.lineChartData[0].data = [];
    this.lineChartData[1].data = [];
    this.lineChartData[2].data = [];
  }
}
