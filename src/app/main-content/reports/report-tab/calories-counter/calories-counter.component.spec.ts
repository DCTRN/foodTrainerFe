import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  getTestBed,
  TestBed,
  tick,
} from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as fromUserProducts from '@stores/user-products/user-products.selectors';
import { initialReportTabState } from '@testsUT/reports/reports-mock-data.model';
import { CaloriesCounterComponent } from './calories-counter.component';

describe('CaloriesCounterComponent', () => {
  let component: CaloriesCounterComponent;
  let fixture: ComponentFixture<CaloriesCounterComponent>;
  let injector: TestBed;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            ...initialReportTabState,
            userProducts: { userProducts: [] },
          },
        }),
      ],
      declarations: [CaloriesCounterComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    fixture = TestBed.createComponent(CaloriesCounterComponent);
    component = fixture.componentInstance;
    store = injector.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get appropriate number of kcals', fakeAsync(() => {
    const numberOfKcal = 100;
    store.overrideSelector(
      fromUserProducts.selectUserProductsKcalByDateRange,
      numberOfKcal
    );

    store.refreshState();
    fixture.detectChanges();
    tick(2000);

    expect(component.kcal).toEqual(numberOfKcal);
  }));
});
