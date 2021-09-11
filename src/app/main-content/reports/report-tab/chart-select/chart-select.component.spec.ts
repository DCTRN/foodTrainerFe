import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { ChartOptions } from '@main-content/reports/itf/chart-options';
import { ReportTabActions } from '@main-content/reports/store/report-tab/report-tab.actions';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialReportTabState } from '@testsUT/reports/reports-mock-data.model';
import { CharSelectComponent } from './chart-select.component';

describe('CharSelectComponent', () => {
  let injector: TestBed;
  let component: CharSelectComponent;
  let fixture: ComponentFixture<CharSelectComponent>;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CharSelectComponent],
      providers: [
        provideMockStore({
          initialState: {
            ...initialReportTabState,
            userProducts: { userProducts: [] },
          },
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    store = injector.inject(MockStore);
    fixture = injector.createComponent(CharSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch update selected char action', () => {
    spyOn(store, 'dispatch');

    component.charSelect.setValue(ChartOptions.BAR);

    expect(store.dispatch).toHaveBeenCalledWith(
      ReportTabActions.UPDATE_SELECTED_TIME_CHART_TYPE({
        selectedChartType: ChartOptions.BAR,
      })
    );
  });
});
