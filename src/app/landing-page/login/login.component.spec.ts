import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationService } from '@core/notifications/service/notification.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { LoginComponent } from './login.component';

const initialState = undefined;

class NotificationServiceMock {
  public info(message: string, duration: number = 5000): void {}
}

describe('LoginComponent', () => {
  let injector: TestBed;
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let store: MockStore;
  let notificationService: NotificationService;

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
      ],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: NotificationService,
          useClass: NotificationServiceMock,
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
    notificationService = injector.inject(NotificationService);
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
    const infoSpy = spyOn(notificationService, 'info');

    component.login();

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(infoSpy).toHaveBeenCalled();

    component.usernameFormControl.setValue('username');
    component.passwordFormControl.setValue('Password123');

    component.login();

    expect(dispatchSpy).toHaveBeenCalled();
    expect(infoSpy).toHaveBeenCalledTimes(1);
  });
});
