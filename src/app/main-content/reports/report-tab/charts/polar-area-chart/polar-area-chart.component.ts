import { Component, OnInit } from '@angular/core';
import { ProductNutritions } from '@core/models/products/product-nutritions.interface';
import {
  setBeginningOfTheDay,
  setEndOfTheDay,
} from '@core/util-functions/util-functions';
import { TimeStamp } from '@main-content/reports/itf/time-stamp.model';
import * as fromReportTab from '@main-content/reports/store/report-tab/report-tab.selectors';
import { Store } from '@ngrx/store';
import * as fromUserProducts from '@stores/user-products/user-products.selectors';
import { ChartType } from 'chart.js';
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns';
import { Label, SingleDataSet } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';

@Component({
  selector: 'app-polar-area-chart',
  templateUrl: './polar-area-chart.component.html',
  styleUrls: ['./polar-area-chart.component.scss'],
})
export class PolarAreaChartComponent implements OnInit {
  public timeStamp: TimeStamp = TimeStamp.MONTHLY;
  // PolarArea
  public polarAreaChartLabels: Label[] = ['Protein', 'Carbs', 'Fats'];
  public polarAreaChartData: SingleDataSet = [];
  public polarAreaLegend = true;

  public polarAreaChartType: ChartType = 'polarArea';
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

  private updateDisplayedData(nutritions: ProductNutritions): void {
    this.polarAreaChartData = [
      nutritions.protein | 0,
      nutritions.carbohydrates | 0,
      nutritions.fats | 0,
    ];
  }
}
