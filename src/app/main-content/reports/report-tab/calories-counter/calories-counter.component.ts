import { Component, OnDestroy, OnInit } from '@angular/core';
import { createDateRanges } from '@core/util-functions/util-functions';
import { TimeStamp } from '@main-content/reports/itf/time-stamp.model';
import * as fromReportTab from '@main-content/reports/store/report-tab/report-tab.selectors';
import { Store } from '@ngrx/store';
import * as fromUserProducts from '@stores/user-products/user-products.selectors';
import { DateRange } from '@stores/user-products/user-products.selectors';
import { Subscription } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';

@Component({
  selector: 'app-calories-counter',
  templateUrl: './calories-counter.component.html',
  styleUrls: ['./calories-counter.component.scss'],
})
export class CaloriesCounterComponent implements OnInit, OnDestroy {
  public kcal: number;

  private dateRanges: Record<TimeStamp, DateRange> = createDateRanges();

  private subscription = new Subscription();

  constructor(private store: Store<AppState>) { }

  public ngOnInit(): void {
    setTimeout(() => {
      this.subscription.add(
        this.store
          .select(fromReportTab.selectCurrentTimeStampType)
          .pipe(
            switchMap((timeStamp: TimeStamp) =>
              this.getUserProductsKcalBy(timeStamp)
            ),
            tap((kcal) => console.warn('kcal: ', kcal))
          )
          .subscribe((kcal) => (this.kcal = kcal))
      );
    }, 3000);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private getUserProductsKcalBy(timeStamp: TimeStamp) {
    return this.store.select(
      fromUserProducts.selectUserProductsKcalByDateRange,
      this.dateRanges[timeStamp]
    );
  }
}
