import { Component, Input, OnInit } from '@angular/core';
import { ProductMacroNutritions } from '@core/models/products/product-macro-nutritions.interface';
import { ProductNutritions } from '@core/models/products/product-nutritions.interface';
import { UserNutritionGoals } from '@core/stores/user/user-nutrition-goals.model';
import * as fromUser from '@core/stores/user/user.selectors';
import {
  calculateProductMacroNutritionsPerPeriod,
  createDateRanges,
} from '@core/util-functions/util-functions';
import { TimeStamp } from '@main-content/reports/itf/time-stamp.model';
import * as fromReportTab from '@main-content/reports/store/report-tab/report-tab.selectors';
import { Store } from '@ngrx/store';
import * as fromUserProducts from '@stores/user-products/user-products.selectors';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
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
  public shouldDisplayChart = false;

  private subscription = new Subscription();

  private dateRanges: Record<number, fromUserProducts.DateRange> =
    createDateRanges();

  constructor(private store: Store<AppState>) {}

  public ngOnInit(): void {
    this.subscription.add(
      this.store
        .select(fromReportTab.selectCurrentTimeStampType)
        .pipe(
          switchMap((timeStamp: TimeStamp) =>
            this.store
              .select(fromUser.selectUserNutritionGoals)
              .pipe(
                map((goals: UserNutritionGoals) =>
                  calculateProductMacroNutritionsPerPeriod(goals, timeStamp)
                )
              )
          )
        )
        .subscribe((v) => this.updateExpectedData(v))
    );

    this.subscription.add(
      this.store
        .select(fromReportTab.selectCurrentTimeStampType)
        .pipe(
          switchMap((timeStamp: TimeStamp) =>
            this.store.select(
              fromUserProducts.selectReducedUserProductsNutritionsByDateRange,
              this.dateRanges[timeStamp]
            )
          ),
          tap(
            (nutritions: ProductNutritions) =>
              (this.shouldDisplayChart =
                nutritions.protein > 0 ||
                nutritions.carbohydrates > 0 ||
                nutritions.fats > 0)
          )
        )
        .subscribe((nutritions: ProductNutritions) =>
          this.updateDisplayedData(nutritions)
        )
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private updateExpectedData(v: ProductMacroNutritions) {
    this.barChartData[0] = {
      data: [v.protein, v.carbohydrates, v.fats],
      label: 'Expected amount',
    };
  }

  private updateDisplayedData(nutritions: ProductNutritions): void {
    this.barChartData[1] = {
      data: [
        nutritions.protein | 0,
        nutritions.carbohydrates | 0,
        nutritions.fats | 0,
      ],
      label: 'Actual amount',
    };
  }
}
