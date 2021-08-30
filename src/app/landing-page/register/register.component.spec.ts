import { HttpClientTestingModule } from '@angular/common/http/testing';
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
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationService } from '@core/notifications/service/notification.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { User } from '@stores/user/user.model';
import { undefinedUser, user1 } from '@testsUT/user/user-mock-data.model';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { ReplaySubject } from 'rxjs';
import { RegisterComponent } from './register.component';

export const initialState: any = {
  user: undefinedUser,
};

const userMock: User = user1;

class NotificationServiceMock {
  public info(message: string, duration: number = 5000): void {}
}

describe('RegisterComponent', () => {
  const actions$ = new ReplaySubject<any>(1);
  let injector: TestBed;
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;
  let store: MockStore;
  let notificationService: NotificationService;

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
        MatSelectModule,
      ],
      providers: [
        {
          provide: NotificationService,
          useClass: NotificationServiceMock,
        },
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
      ],
      declarations: [RegisterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    router = injector.inject(Router);
    store = injector.inject(MockStore);
    notificationService = injector.inject(NotificationService);
    fixture = injector.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return to main page', () => {
    const routerSpy = spyOn(router, 'navigateByUrl');

    component.navigateToMainPage();

    expect(routerSpy).toHaveBeenCalledWith('/landing-page');
  });

  it('should not dispatch register action if form is not valid', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const infoSpy = spyOn(notificationService, 'info');

    component.register();

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(infoSpy).toHaveBeenCalled();
  });

  it('should dispatch register action if valid form', () => {
    component.usernameFormControl.setValue(userMock.username);
    component.passwordFormControl.setValue('Password123');
    component.passwordConfirmationFormControl.setValue('Password123');
    component.emailFormControl.setValue(userMock.email);
    component.phoneNumberFormControl.setValue(userMock.phoneNumber);
    component.birthDateFormControl.setValue(new Date());
    component.firstNameFormControl.setValue(userMock.firstName);
    component.lastNameFormControl.setValue(userMock.lastName);
    component.ageFormControl.setValue(userMock.details.age);
    component.heightFormControl.setValue(userMock.details.height);
    component.weightFormControl.setValue(userMock.details.weight);
    component.sexFormControl.setValue(userMock.details.sex);
    const dispatchSpy = spyOn(store, 'dispatch');

    component.register();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  it('should set value from store', () => {
    component.ngOnDestroy();
    store.setState({
      user: userMock,
    });
    store.refreshState();

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.usernameFormControl.value).toEqual(userMock.username);
    expect(component.emailFormControl.value).toEqual(userMock.email);
    expect(component.phoneNumberFormControl.value).toEqual(
      userMock.phoneNumber
    );
    expect(component.birthDateFormControl.value).toEqual(userMock.birthDate);
    expect(component.firstNameFormControl.value).toEqual(userMock.firstName);
    expect(component.lastNameFormControl.value).toEqual(userMock.lastName);
    expect(component.ageFormControl.value).toEqual(userMock.details.age);
    expect(component.heightFormControl.value).toEqual(userMock.details.height);
    expect(component.weightFormControl.value).toEqual(userMock.details.weight);
    expect(component.sexFormControl.value).toEqual(userMock.details.sex);
  });
});
