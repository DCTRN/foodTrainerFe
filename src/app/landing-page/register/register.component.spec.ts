import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { User } from '@stores/user/user.model';
import { RegisterComponent } from './register.component';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

export const initialState: any = {
  user: {
    username: undefined,
    email: undefined,
    birthDate: undefined,
    phoneNumber: undefined,
    firstName: undefined,
    lastName: undefined,
    id: undefined,
    authenticationLevel: undefined,
  },
};

const userMock: User = {
  username: 'mike8',
  password: 'haslo1234',
  email: 'michal.kowalski@gmail.com',
  phoneNumber: '123123123',
  birthDate: new Date(),
  firstName: 'majkel',
  lastName: 'majk',
};

describe('RegisterComponent', () => {
  let injector: TestBed;
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;
  let store: MockStore;

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
        LoggerTestingModule,
        MatSnackBarModule,
      ],
      providers: [provideMockStore({ initialState })],
      declarations: [RegisterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = injector.inject(Router);
    store = injector.inject(MockStore);
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

    component.register();

    expect(dispatchSpy).not.toHaveBeenCalled();

    component.usernameFormControl.setValue(userMock.username);
    component.passwordFormControl.setValue('Password123');
    component.passwordConfirmationFormControl.setValue('Password123');
    component.emailFormControl.setValue(userMock.email);
    component.phoneNumberFormControl.setValue(userMock.phoneNumber);
    component.birthDateFormControl.setValue(new Date());
    component.firstNameFormControl.setValue(userMock.firstName);
    component.lastNameFormControl.setValue(userMock.lastName);

    component.register();

    expect(dispatchSpy).toHaveBeenCalled();
  });
});
