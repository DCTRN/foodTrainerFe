import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ChartsModule } from 'ng2-charts';
import { PieChartComponent } from './charts/pie-chart/pie-chart.component';
import { ReportTabModule } from './report-tab/report-tab.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';

@NgModule({
  declarations: [ReportsComponent, PieChartComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MatTabsModule,
    ChartsModule,
    ReportTabModule,
  ],
})
export class ReportsModule {}
