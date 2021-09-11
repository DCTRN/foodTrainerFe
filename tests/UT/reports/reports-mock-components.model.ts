import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { TimeStamp } from '@main-content/reports/itf/time-stamp.model';

@Component({
  selector: 'app-report-tab',
  template: '',
})
export class ReportTabComponentMock implements OnInit, OnDestroy {
  @Input()
  public timeStampInit: TimeStamp;

  @ViewChild('componentContainer', { read: ViewContainerRef, static: true })
  public container: ViewContainerRef;

  public timeStamp: TimeStamp = TimeStamp.DAILY;

  constructor() {}

  public ngOnInit(): void {}

  public ngOnDestroy(): void {}
}
