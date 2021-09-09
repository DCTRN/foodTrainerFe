import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { StoreModule } from '@ngrx/store';
import { ChartsModule } from 'ng2-charts';
import { PieChartComponent } from './charts/pie-chart/pie-chart.component';
import { ReportTabModule } from './report-tab/report-tab.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { reportTabReducer } from './store/report-tab/report-tab.reducer';

@NgModule({
  declarations: [ReportsComponent, PieChartComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MatTabsModule,
    ChartsModule,
    ReportTabModule,
    StoreModule.forFeature('reportTab', reportTabReducer),
  ],
})
export class ReportsModule {}
