import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CaloriesCounterComponent } from './calories-counter/calories-counter.component';
import { CharSelectComponent } from './chart-select/chart-select.component';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';
import { LineChartComponent } from './charts/line-chart/line-chart.component';
import { PieChartComponent } from './charts/pie-chart/pie-chart.component';
import { ReportTabComponent } from './report-tab.component';
import { ChartsModule } from 'ng2-charts';
import { MatButtonModule } from '@angular/material/button';
import { PolarAreaChartComponent } from './charts/polar-area-chart/polar-area-chart.component';

@NgModule({
  declarations: [
    ReportTabComponent,
    CaloriesCounterComponent,
    CharSelectComponent,
    BarChartComponent,
    PieChartComponent,
    LineChartComponent,
    PolarAreaChartComponent,
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    MatButtonModule,
  ],
  exports: [ReportTabComponent],
})
export class ReportTabModule {}
