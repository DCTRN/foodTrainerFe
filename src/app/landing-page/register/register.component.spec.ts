import {
  async,
  ComponentFixture,
  TestBed,
  getTestBed,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './register.component';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RegisterComponent', () => {
  let injector: TestBed;
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatNativeDateModule,
        MatDatepickerModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      declarations: [RegisterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = injector.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return to main page', () => {
    const routerSpy = spyOn(router, 'navigateByUrl');

    component.navigateToMainPage();

    expect(routerSpy).toHaveBeenCalledWith('/landing-page');
  });
});
