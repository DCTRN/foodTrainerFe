import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '@core/models/products';
import { UserProduct } from '@core/models/user-products';
import {
  UserProducts,
  UserProductsAction,
} from '@core/stores/user-products/user-products.actions';
import {
  calculateShare,
  convertToPrecision,
} from '@core/util-functions/util-functions';
import { select, Store } from '@ngrx/store';
import { ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { BaseChartDirective, Label } from 'ng2-charts';
import { map } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit {
  @ViewChild(BaseChartDirective, { static: true })
  public chart: BaseChartDirective;

  public product: Partial<Product> = {
    kcal: 0,
    protein: 0,
    carbohydrates: 0,
    fats: 0,
  };
  public columns: string[] = ['protein', 'carbohydrates', 'fats', 'kcal'];
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
  public pieChartLabels: Label[] = [['Protein'], ['Carbohydrates'], ['Fats']];
  public pieChartData: number[] = [
    this.product.protein,
    this.product.carbohydrates,
    this.product.fats,
  ];
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

  constructor(
    private store: Store<AppState>,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.store.dispatch(
      UserProductsAction.GET_USER_PRODUCTS_BY_DATE_REQUEST({
        userProductsBy: { date: new Date() },
      })
    );
    this.store
      .pipe(
        select('userProducts'),
        map((userProducts: UserProducts) => userProducts.userProducts)
      )
      .subscribe((userProducts: UserProduct[]) =>
        this.updateDisplayedProductsSummary(userProducts)
      );
  }

  // events
  public chartClicked({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  private updateDisplayedProductsSummary(userProducts: UserProduct[]): void {
    this.columns.forEach(
      (key: string) =>
        (this.product[key] = userProducts.reduce(
          (p, c) => convertToPrecision((p += this.reducePropertyBy(c, key))),
          0
        ))
    );
    this.pieChartData.length = 0;
    this.pieChartData.push(this.product.protein);
    this.pieChartData.push(this.product.carbohydrates);
    this.pieChartData.push(this.product.fats);
    console.warn(this.product);
    this.chart.update();
    this.changeDetectorRef.detectChanges();
  }

  private reducePropertyBy(c: UserProduct, key: string): number {
    return convertToPrecision(
      calculateShare(c.amount, c.product.amount) * c.product[key]
    );
  }
}
