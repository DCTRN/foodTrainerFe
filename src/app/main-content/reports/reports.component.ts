import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Action, Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { TimeStamp } from './itf/time-stamp.model';
import { ReportTabActions } from './store/report-tab/report-tab.actions';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  private tabToTimeStampMapping: Record<number, TimeStamp> = {
    0: TimeStamp.DAILY,
    1: TimeStamp.WEEKLY,
    2: TimeStamp.MONTHLY,
  };

  constructor(private store: Store<AppState>) {}

  public ngOnInit(): void {}

  public onSelectedTabChange(event: MatTabChangeEvent) {
    this.store.dispatch(this.createUpdateSelectedTimeStampAction(event));
  }

  private createUpdateSelectedTimeStampAction(
    event: MatTabChangeEvent
  ): Action {
    return ReportTabActions.UPDATE_SELECTED_TIME_STAMP({
      selectedTimeStamp: this.gerAppropriateTimeStamp(event),
    });
  }

  private gerAppropriateTimeStamp(event: MatTabChangeEvent): TimeStamp {
    return this.tabToTimeStampMapping[event.index];
  }
}
