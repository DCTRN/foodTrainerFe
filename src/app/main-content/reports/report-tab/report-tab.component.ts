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
import { createUserproductsGetByDateActionsPerTimeStamp } from '@core/util-functions/util-functions';
import * as ReportTabSelects from '@main-content/reports/store/report-tab/report-tab.selectors';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { ChartOptions } from '../itf/chart-options';
import { TimeStamp } from '../itf/time-stamp.model';

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
  private userProductsByDateActions =
    createUserproductsGetByDateActionsPerTimeStamp();
  private subscriptions = new Subscription();

  constructor(
    private store: Store<AppState>,
    private componentLoader: ComponentLoaderService
  ) {}

  public ngOnInit(): void {
    this.subscribeToTimeStamp();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private subscribeToTimeStamp() {
    this.subscriptions.add(
      this.store
        .select(ReportTabSelects.selectCurrentTimeStampType)
        .pipe(
          distinctUntilChanged(),
          filter((timeStamp: TimeStamp) =>
            this.isComponentDisplayed(timeStamp)
          ),
          tap((timeStamp: TimeStamp) => this.getUserProductsByDate(timeStamp)),
          switchMap(() => this.loadChart())
        )
        .subscribe()
    );
  }

  private loadChart() {
    return this.store.select(ReportTabSelects.selectSelectedChartType).pipe(
      distinctUntilChanged(),
      tap((chart: ChartOptions) => this.loadComponent(chart))
    );
  }

  private isComponentDisplayed(currentTimeStamp: TimeStamp): boolean {
    return currentTimeStamp === this.timeStampInit;
  }

  private getUserProductsByDate(currentTimeStamp: TimeStamp) {
    this.timeStamp = currentTimeStamp;
    this.store.dispatch(this.userProductsByDateActions[this.timeStamp]);
  }

  private loadComponent(component: ChartOptions): void {
    this.container.clear();
    this.componentLoader
      .loadComponent(this.container, this.components[component])
      .pipe(take(1))
      .subscribe();
  }
}
