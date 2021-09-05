import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReportTabComponent } from './report-tab.component';
import { CaloriesCounterComponent } from './calories-counter/calories-counter.component';

@NgModule({
  declarations: [ReportTabComponent, CaloriesCounterComponent],
  imports: [CommonModule],
  exports: [ReportTabComponent],
})
export class ReportTabModule {}
