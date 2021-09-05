import { Component, OnInit } from '@angular/core';
import { TimeStamp } from './itf/time-stamp.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  public timeStamp = TimeStamp;

  constructor() {}

  public ngOnInit(): void {}
}
