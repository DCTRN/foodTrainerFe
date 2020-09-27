import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { LoginComponent } from './login.component';
import { LoggerTestingModule } from 'ngx-logger/testing';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarModule,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

const initialState = undefined;

@Injectable()
class MatSnackBarMock {
  public open(
    message: string,
    action?: string,
    config?: MatSnackBarConfig
  ): MatSnackBarRef<TextOnlySnackBar> {
    return null;
  }
}

describe('LoginComponent', () => {
  let injector: TestBed;
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let store: MockStore;
  let snackBar: MatSnackBar;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        LoggerTestingModule,
        MatSnackBarModule,
      ],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: MatSnackBar,
          useClass: MatSnackBarMock,
        },
      ],
      declarations: [LoginComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    fixture = injector.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = injector.inject(Router);
    store = injector.inject(MockStore);
    snackBar = injector.inject(MatSnackBar);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return to main page', () => {
    const routerSpy = spyOn(router, 'navigateByUrl');

    component.navigateToMainPage();

    expect(routerSpy).toHaveBeenCalledWith('/landing-page');
  });

  it('should dispatch register action if valid form', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    component.login();

    expect(dispatchSpy).not.toHaveBeenCalled();

    component.usernameFormControl.setValue('username');
    component.passwordFormControl.setValue('Password123');

    component.login();

    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should show snackbar if user tries to login without filled and valid inputs', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const openSpy = spyOn(snackBar, 'open');

    component.login();

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalled();

    component.usernameFormControl.setValue('username');
    component.passwordFormControl.setValue('Password123');

    component.login();

    expect(dispatchSpy).toHaveBeenCalled();
  });
});
