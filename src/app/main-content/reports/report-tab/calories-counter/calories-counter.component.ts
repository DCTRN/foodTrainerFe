import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  setBeginningOfTheDay,
  setEndOfTheDay,
} from '@core/util-functions/util-functions';
import { TimeStamp } from '@main-content/reports/itf/time-stamp.model';
import * as fromReportTab from '@main-content/reports/store/report-tab/report-tab.selectors';
import { Store } from '@ngrx/store';
import * as fromUserProducts from '@stores/user-products/user-products.selectors';
import { DateRange } from '@stores/user-products/user-products.selectors';
import { startOfWeek } from 'date-fns';
import endOfMonth from 'date-fns/endOfMonth';
import endOfWeek from 'date-fns/endOfWeek';
import startOfMonth from 'date-fns/startOfMonth';
import { Subscription } from 'rxjs';
import { concatMap, switchMap, take } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';

@Component({
  selector: 'app-calories-counter',
  templateUrl: './calories-counter.component.html',
  styleUrls: ['./calories-counter.component.scss'],
})
export class CaloriesCounterComponent implements OnInit, OnDestroy {
  public timeStamp: TimeStamp = TimeStamp.DAILY;
  public kcal: number;

  private dateRanges: Record<number, DateRange> = {
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
              fromUserProducts.selectUserProductsKcalByDateRange,
              this.dateRanges[timeStamp]
            )
          )
        )
        .subscribe((kcal) => (this.kcal = kcal))
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
