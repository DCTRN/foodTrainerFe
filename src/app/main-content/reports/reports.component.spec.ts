import { Component, Input, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimeStamp } from './itf/time-stamp.model';
import { ReportsComponent } from './reports.component';

@Component({
  selector: 'app-report-tab',
  template: '',
})
export class ReportTabComponentMock implements OnInit {
  @Input()
  public timeStamp: TimeStamp = TimeStamp.DAILY;
  constructor() {}

  public ngOnInit(): void {}
}

fdescribe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatTabsModule, BrowserAnimationsModule],
      declarations: [ReportsComponent, ReportTabComponentMock],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
