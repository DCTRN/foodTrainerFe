import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  getTestBed,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  initialReportTabState,
  updateTimeStampDaily,
  updateTimeStampMonthly,
  updateTimeStampWeekly,
} from '@testsUT/reports/reports-mock-data.model';
import { TimeStamp } from '../itf/time-stamp.model';
import { ReportTabComponent } from './report-tab.component';

export interface ActionWithTimeStampInit {
  action: Action;
  timeStamp: TimeStamp;
}

export const timeStampUpdateActions: Array<ActionWithTimeStampInit> = [
  { action: updateTimeStampDaily, timeStamp: TimeStamp.DAILY },
  { action: updateTimeStampWeekly, timeStamp: TimeStamp.WEEKLY },
  { action: updateTimeStampMonthly, timeStamp: TimeStamp.MONTHLY },
];

describe('ReportTabComponent', () => {
  let component: ReportTabComponent;
  let fixture: ComponentFixture<ReportTabComponent>;
  let injector: TestBed;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: initialReportTabState })],
      declarations: [ReportTabComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTabComponent);
    component = fixture.componentInstance;
    injector = getTestBed();
    store = injector.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO spy on disptach and check the action types
  it('should get user products for each time stamp', fakeAsync(() => {
    spyOn(store, 'dispatch');

    timeStampUpdateActions.forEach((value: ActionWithTimeStampInit) => {
      store.setState({
        ...initialReportTabState,
        reportTab: {
          selectedChartType: initialReportTabState.reportTab.selectedChartType,
          timeStamp: value.timeStamp,
        },
      });
      store.refreshState();
      tick(2000);
      component.timeStampInit = value.timeStamp;
      component.ngOnDestroy();
      component.ngOnInit();
    });
    tick(2000);

    expect(store.dispatch).toHaveBeenCalledTimes(3);
  }));
});
