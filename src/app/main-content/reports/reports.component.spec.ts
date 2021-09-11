import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReportTabComponentMock } from '@testsUT/reports/reports-mock-components.model';
import {
  updateTimeStampWeekly,
  initialReportTabState,
  matTabEvent2,
} from '@testsUT/reports/reports-mock-data.model';
import { AppState } from 'src/app/reducers';
import { ReportsComponent } from './reports.component';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;
  let injector: TestBed;
  let store: MockStore<AppState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: initialReportTabState })],
      imports: [MatTabsModule, BrowserAnimationsModule],
      declarations: [ReportsComponent, ReportTabComponentMock],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    store = injector.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change time stamp once to weekly', () => {
    spyOn(store, 'dispatch');

    component.onSelectedTabChange(matTabEvent2);

    expect(store.dispatch).toHaveBeenCalledWith(updateTimeStampWeekly);
  });
});
