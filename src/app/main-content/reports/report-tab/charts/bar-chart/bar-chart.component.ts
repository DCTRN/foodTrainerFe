import { Component, Input, OnInit } from '@angular/core';
import { ProductNutritions } from '@core/models/products/product-nutritions.interface';
import { UserNutritionGoals } from '@core/stores/user/user-nutrition-goals.model';
import * as fromUser from '@core/stores/user/user.selectors';
import {
  calculateProductMacroNutritionsPerPeriod,
  setBeginningOfTheDay,
  setEndOfTheDay,
} from '@core/util-functions/util-functions';
import { TimeStamp } from '@main-content/reports/itf/time-stamp.model';
import { Store } from '@ngrx/store';
import * as fromUserProducts from '@stores/user-products/user-products.selectors';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns';
import { Label } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit {
  @Input()
  public timeStamp: TimeStamp = TimeStamp.MONTHLY;
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public barChartLabels: Label[] = ['Protein', 'Carbs', 'Fats'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [];

  private subscription = new Subscription();

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

  constructor(private store: Store<AppState>) {}

  public ngOnInit(): void {
    this.store
      .select(fromUser.selectUserNutritionGoals)
      .pipe(
        take(1),
        map((goals: UserNutritionGoals) =>
          calculateProductMacroNutritionsPerPeriod(goals, this.timeStamp)
        )
      )
      .subscribe((v) => {
        console.warn(v);
        this.barChartData[0] = {
          data: [v.protein, v.carbohydrates, v.fats],
          label: 'Expected amount',
        };
      });

    this.subscription.add(
      this.store
        .select(
          fromUserProducts.selectUserProductsNutritionsByDateRange,
          this.dateRanges[this.timeStamp]
        )
        .pipe()
        .subscribe(
          (nutritions: ProductNutritions) =>
            (this.barChartData[1] = {
              data: [
                nutritions.protein | 0,
                nutritions.carbohydrates | 0,
                nutritions.fats | 0,
              ],
              label: 'Actual amount',
            })
        )
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
