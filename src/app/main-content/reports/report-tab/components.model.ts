import { ComponentLoader } from '@core/models/component-loader.interface';
import { ChartOptions } from '../itf/chart-options';


export const components: { [key: string]: ComponentLoader; } = {
  [ChartOptions.PIE]: {
    loadComponent: () => import('./charts/pie-chart/pie-chart.component').then(
      (m) => m.PieChartComponent
    ),
  },
  [ChartOptions.BAR]: {
    loadComponent: () => import('./charts/bar-chart/bar-chart.component').then(
      (m) => m.BarChartComponent
    ),
  },
  [ChartOptions.POLAR_AREA]: {
    loadComponent: () => import('./charts/polar-area-chart/polar-area-chart.component').then(
      (m) => m.PolarAreaChartComponent
    ),
  },
  [ChartOptions.LINE]: {
    loadComponent: () => import('./charts/line-chart/line-chart.component').then(
      (m) => m.LineChartComponent
    ),
  },
};
