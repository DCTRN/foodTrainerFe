import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaloriesCounterComponent } from './calories-counter.component';

describe('CaloriesCounterComponent', () => {
  let component: CaloriesCounterComponent;
  let fixture: ComponentFixture<CaloriesCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaloriesCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaloriesCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
