import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { ProductWrapperComponent } from './product-wrapper.component';

describe('ProductWrapperComponent', () => {
  let injector: TestBed;
  let component: ProductWrapperComponent;
  let fixture: ComponentFixture<ProductWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductWrapperComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    fixture = TestBed.createComponent(ProductWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
