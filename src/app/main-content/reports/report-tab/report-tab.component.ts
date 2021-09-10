import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ComponentLoader } from '@core/models/component-loader.interface';
import { ComponentLoaderService } from '@core/services/component-loader/component-loader.service';
import { UserProductsAction } from '@core/stores/user-products/user-products.actions';
import {
  removeOffset,
  setBeginningOfTheDay,
} from '@core/util-functions/util-functions';
import * as ReportTabSelects from '@main-content/reports/store/report-tab/report-tab.selectors';
import { Store } from '@ngrx/store';
import {
  addHours,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  take,
} from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { ChartOptions } from '../itf/chart-options';
import { TimeStamp } from '../itf/time-stamp.model';

export enum ChartsComponents {
  PIE_CHART,
  BAR_CHART,
  LINE_CHART,
  POLAR_AREA_CHART,
}

@Component({
  selector: 'app-report-tab',
  templateUrl: './report-tab.component.html',
  styleUrls: ['./report-tab.component.scss'],
})
export class ReportTabComponent implements OnInit, OnDestroy {
  @Input()
  public timeStampInit: TimeStamp;

  @ViewChild('componentContainer', { read: ViewContainerRef, static: true })
  public container: ViewContainerRef;

  public timeStamp: TimeStamp = TimeStamp.DAILY;

  private readonly timeStampActionDispatchers: Record<number, () => void> = {
    [TimeStamp.DAILY]: () => this.dispatchGetUserProductsForTodaysDate(),
    [TimeStamp.WEEKLY]: () => this.dispatchGetUserProductsForCurrentWeek(),
    [TimeStamp.MONTHLY]: () => this.dispatchGetUserProductsForCurrentMonth(),
  };

  private readonly components: { [key: string]: ComponentLoader } = {
    [ChartOptions.PIE]: {
      loadComponent: () =>
        import('./charts/pie-chart/pie-chart.component').then(
          (m) => m.PieChartComponent
        ),
    },
    [ChartOptions.BAR]: {
      loadComponent: () =>
        import('./charts/bar-chart/bar-chart.component').then(
          (m) => m.BarChartComponent
        ),
    },
    [ChartOptions.POLAR_AREA]: {
      loadComponent: () =>
        import('./charts/polar-area-chart/polar-area-chart.component').then(
          (m) => m.PolarAreaChartComponent
        ),
    },
    [ChartOptions.LINE]: {
      loadComponent: () =>
        import('./charts/line-chart/line-chart.component').then(
          (m) => m.LineChartComponent
        ),
    },
  };
  private subscriptions = new Subscription();

  constructor(
    private store: Store<AppState>,
    private componentLoader: ComponentLoaderService
  ) {}

  public ngOnInit(): void {
    this.subscriptions.add(
      this.store
        .select(ReportTabSelects.selectCurrentTimeStampType)
        .pipe(
          distinctUntilChanged(),
          filter(
            (currentTimeStamp: TimeStamp) =>
              currentTimeStamp === this.timeStampInit
          )
        )
        .subscribe((currentTimeStamp: TimeStamp) => {
          this.timeStamp = currentTimeStamp;
          this.timeStampActionDispatchers[currentTimeStamp]();
        })
    );

    this.subscriptions.add(
      this.store
        .select(ReportTabSelects.selectSelectedChartType)
        .pipe(debounceTime(200), distinctUntilChanged())
        .subscribe((chart: ChartOptions) => this.loadComponent(chart))
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadComponent(component: ChartOptions): void {
    this.container.clear();
    this.componentLoader
      .loadComponent(this.container, this.components[component])
      .pipe(take(1))
      .subscribe();
  }

  private dispatchGetUserProductsForTodaysDate(): void {
    const today = {
      date: removeOffset(setBeginningOfTheDay(new Date())),
    };
    return this.store.dispatch(
      UserProductsAction.GET_USER_PRODUCTS_BY_DATE_REQUEST({
        userProductsBy: today,
      })
    );
  }

  private dispatchGetUserProductsForCurrentWeek(): void {
    const week = {
      start: removeOffset(startOfWeek(new Date(), { weekStartsOn: 1 })),
      end: removeOffset(
        setBeginningOfTheDay(endOfWeek(new Date(), { weekStartsOn: 1 }))
      ),
    };
    return this.store.dispatch(
      UserProductsAction.GET_USER_PRODUCTS_BY_DATE_RANGE_REQUEST({
        userProductsBy: week,
      })
    );
  }

  private dispatchGetUserProductsForCurrentMonth(): void {
    const month = {
      start: removeOffset(startOfMonth(new Date())),
      end: removeOffset(setBeginningOfTheDay(endOfMonth(new Date()))),
    };
    return this.store.dispatch(
      UserProductsAction.GET_USER_PRODUCTS_BY_DATE_RANGE_REQUEST({
        userProductsBy: month,
      })
    );
  }
}
