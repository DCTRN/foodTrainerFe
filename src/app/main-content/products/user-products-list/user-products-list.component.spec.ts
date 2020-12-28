import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { UserProductsListComponent } from './user-products-list.component';

describe('UserProductsListComponent', () => {
  let injector: TestBed;
  let component: UserProductsListComponent;
  let fixture: ComponentFixture<UserProductsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserProductsListComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    fixture = TestBed.createComponent(UserProductsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
