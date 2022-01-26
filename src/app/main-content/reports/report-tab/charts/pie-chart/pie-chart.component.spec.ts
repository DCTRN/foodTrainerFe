import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { selectReducedUserProductsNutritionsByDateRange } from '@core/stores/user-products/user-products.selectors';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  initialReportTabState,
  productNutritionsMock0,
  productNutritionsMock1,
} from '@testsUT/reports/reports-mock-data.model';
import { PieChartComponent } from './pie-chart.component';

describe('PieChartComponent', () => {
  let component: PieChartComponent;
  let fixture: ComponentFixture<PieChartComponent>;
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
      declarations: [PieChartComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    fixture = TestBed.createComponent(PieChartComponent);
    component = fixture.componentInstance;
    store = injector.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update display data with reduced nutritions', () => {
    store.overrideSelector(
      selectReducedUserProductsNutritionsByDateRange,
      productNutritionsMock1
    );
    store.refreshState();
    fixture.detectChanges();

    expect(component.pieChartData[0]).toEqual(productNutritionsMock1.protein);
    expect(component.pieChartData[1]).toEqual(
      productNutritionsMock1.carbohydrates
    );
    expect(component.pieChartData[2]).toEqual(productNutritionsMock1.fats);
    expect(component.shouldDisplayChart).toEqual(true);
  });

  it('should not display chart', () => {
    store.overrideSelector(
      selectReducedUserProductsNutritionsByDateRange,
      productNutritionsMock0
    );
    store.refreshState();
    fixture.detectChanges();

    expect(component.shouldDisplayChart).toEqual(false);
  });
});
