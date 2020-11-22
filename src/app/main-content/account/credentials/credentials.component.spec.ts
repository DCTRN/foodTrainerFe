import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  getTestBed,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationService } from '@core/notifications/service/notification.service';
import { UserAction } from '@core/stores/user/user.actions';
import { User } from '@core/stores/user/user.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { ReplaySubject } from 'rxjs';
import { CredentialsComponent } from './credentials.component';

const userInitial: User = {
  username: 'mike8',
  email: 'michal.kowalski@gmail.com',
  phoneNumber: '123123123',
  birthDate: new Date(),
  firstName: 'majkel',
  lastName: 'majk',
  id: 5,
  authenticationLevel: 1,
};
export const initialState: any = {
  user: userInitial,
};

class NotificationServiceMock {
  public success(message: string, duration: number = 5000): void {}
  public error(message: string, duration: number = 5000): void {}
  public warrning(message: string, duration: number = 5000): void {}
  public info(message: string, duration: number = 5000): void {}
}

describe('CredentialsComponent', () => {
  const actions$ = new ReplaySubject(1);
  let injector: TestBed;
  let component: CredentialsComponent;
  let fixture: ComponentFixture<CredentialsComponent>;
  let store: MockStore;
  let notificationService: NotificationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CredentialsComponent],
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
      ],
      providers: [
        {
          provide: NotificationService,
          useClass: NotificationServiceMock,
        },
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    notificationService = injector.inject(NotificationService);
    store = injector.inject(MockStore);
    fixture = injector.createComponent(CredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fill forms with current value from store', () => {
    const username = component.usernameFormControl.value;
    const email = component.emailFormControl.value;
    const phoneNumber = component.phoneNumberFormControl.value;
    const firstName = component.firstNameFormControl.value;
    const lastName = component.lastNameFormControl.value;

    expect(username).toEqual(userInitial.username);
    expect(email).toEqual(userInitial.email);
    expect(phoneNumber).toEqual(userInitial.phoneNumber);
    expect(firstName).toEqual(userInitial.firstName);
    expect(lastName).toEqual(userInitial.lastName);
  });

  it('should send update credentials action', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const infoSpy = spyOn(notificationService, 'info');

    component.firstNameFormControl.setValue('a');
    component.lastNameFormControl.setValue('a');

    fixture.detectChanges();

    component.updateCredentials();

    expect(infoSpy).toHaveBeenCalled();
    expect(dispatchSpy).not.toHaveBeenCalled();

    component.firstNameFormControl.setValue('changedFirstName');
    component.lastNameFormControl.setValue('changedLastName');

    component.updateCredentials();

    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  it('should send update credentials action', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const infoSpy = spyOn(notificationService, 'info');

    component.firstNameFormControl.setValue('a');
    component.lastNameFormControl.setValue('a');

    fixture.detectChanges();

    component.updateCredentials();

    expect(infoSpy).toHaveBeenCalled();
    expect(dispatchSpy).not.toHaveBeenCalled();

    component.firstNameFormControl.setValue('changedFirstName');
    component.lastNameFormControl.setValue('changedLastName');

    component.updateCredentials();

    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  it('should disable / enable button dependng on changes', fakeAsync(() => {
    store.dispatch(UserAction.USER_UPDATE(userInitial));

    expect(component.disabled).toEqual(true);

    component.firstNameFormControl.setValue('changedFirstName');
    component.lastNameFormControl.setValue('changedLastName');

    expect(component.disabled).toEqual(false);
  }));
});
