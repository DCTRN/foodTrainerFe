import { Component, Input, OnInit } from '@angular/core';
import { UserProductsAction } from '@core/stores/user-products/user-products.actions';
import { incrementDateByDay } from '@core/util-functions/util-functions';
import { Action, Store } from '@ngrx/store';
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/reducers';
import { TimeStamp } from '../itf/time-stamp.model';
import { ChartOptions } from './chart-select/chart-select.component';

@Component({
  selector: 'app-report-tab',
  templateUrl: './report-tab.component.html',
  styleUrls: ['./report-tab.component.scss'],
})
export class ReportTabComponent implements OnInit {
  @Input()
  public timeStamp: TimeStamp = TimeStamp.DAILY;

  private timeStampActionDispatchers: Record<number, () => void> = {
    [TimeStamp.DAILY]: () => this.dispatchGetUserProductsForTodaysDate(),
    [TimeStamp.WEEKLY]: () => this.dispatchGetUserProductsForCurrentWeek(),
    [TimeStamp.MONTHLY]: () => this.dispatchGetUserProductsForCurrentMonth(),
  };
  private subscription = new Subscription();

  constructor(private store: Store<AppState>) {}

  public ngOnInit(): void {
    this.timeStampActionDispatchers[this.timeStamp]();
  }

  public onChartSelectChange(chartSelect: ChartOptions): void {
    console.warn('chartSelect', chartSelect);
  }

  private dispatchGetUserProductsForTodaysDate(): void {
    console.warn('disptaching for today!!!!');
    return this.store.dispatch(
      UserProductsAction.GET_USER_PRODUCTS_BY_DATE_REQUEST({
        userProductsBy: {
          date: new Date(),
        },
      })
    );
  }

  private dispatchGetUserProductsForCurrentWeek(): void {
    console.warn('disptaching for this weeek!!!!');
    return this.store.dispatch(
      UserProductsAction.GET_USER_PRODUCTS_BY_DATE_RANGE_REQUEST({
        userProductsBy: {
          start: startOfWeek(new Date(), { weekStartsOn: 1 }),
          end: endOfWeek(new Date(), { weekStartsOn: 1 }),
        },
      })
    );
  }

  private dispatchGetUserProductsForCurrentMonth(): void {
    console.warn('disptaching for this moth!!!!');
    return this.store.dispatch(
      UserProductsAction.GET_USER_PRODUCTS_BY_DATE_RANGE_REQUEST({
        userProductsBy: {
          start: startOfMonth(new Date()),
          end: endOfMonth(new Date()),
        },
      })
    );
  }
}
