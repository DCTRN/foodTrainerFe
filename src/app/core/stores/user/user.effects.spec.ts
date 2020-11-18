import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Injectable } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginCredentials } from '@api/authentication/login-credentials.model';
import { AuthenticationTimerService } from '@core/authentication/authentication-timer.service';
import { TokensStorageService } from '@core/authentication/tokens-storage.service';
import { NotificationService } from '@core/notifications/service/notification.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { Observable, of, ReplaySubject, throwError } from 'rxjs';
import { AuthenticationService } from '../../authentication/authentication.service';
import { TokensAction } from '../tokens/tokens.actions';
import { Tokens } from '../tokens/tokens.model';
import { UserAction } from './user.actions';
import { UserEffects } from './user.effects';
import { User } from './user.model';

const initialState = undefined;

@Component({
  selector: 'app-mock',
  template: '',
})
class MockComponent {}

@Injectable()
class RouterMock {
  public navigateByUrl(route: string): void {}
}

export const userMock: User = {
  username: 'mike8',
  password: 'haslo1234',
  email: 'michal.kowalski@gmail.com',
  phoneNumber: '123123123',
  birthDate: null,
  firstName: 'majkel',
  lastName: 'majk',
};

export const userFromBeMock: User = {
  username: 'mike8',
  email: 'michal.kowalski@gmail.com',
  birthDate: null,
  phoneNumber: '123123123',
  firstName: 'majkel',
  lastName: 'majk',
  id: 22,
  authenticationLevel: 1,
};

export const tokensMock = {
  access_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1pa2UxMjMiLCJwYXNzd29yZCI6Imhhc2xvMTIzNCIsImlhdCI6MTU5NzU4MTgyMywiZXhwIjoxNTk3NTgyMTIzfQ.9wAi_LmInRynGftD1Ql8FiYh5eB3DLcSFSXRzawTXKk',
  refresh_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1pa2UxMjMiLCJwYXNzd29yZCI6Imhhc2xvMTIzNCIsImlhdCI6MTU5NzU4MTgyMywiZXhwIjoxNjAwMTczODIzfQ.tT3JfnXm56Z-EnixMk4tmbfqRyAn2RGEjGyD7DDjUUg',
  expires_in: 300,
};

@Injectable()
export class TokensStorageServiceMock {
  private tokens: Tokens = tokensMock;

  constructor() {}

  public setTokens(tokens: Tokens): void {
    this.tokens = tokens;
  }

  public getTokens(): Tokens {
    return this.tokens;
  }
}

@Injectable()
class AuthenticationTimerServiceMock {
  public start(): void {}
  public clear(): void {}
}

@Injectable()
class AuthenticationServiceMock {
  public login(credentials: LoginCredentials): Observable<Tokens> {
    return of(tokensMock);
  }

  public register(user: User): Observable<User> {
    return of(userFromBeMock);
  }
}

class NotificationServiceMock {
  public success(message: string, duration: number = 5000): void {}
  public error(message: string, duration: number = 5000): void {}
}

describe('User effects', () => {
  let injector: TestBed;
  let service: UserEffects;
  let authenticationService: AuthenticationService;
  let router: Router;
  let notificationService: NotificationService;
  let authenticationTimerService: AuthenticationTimerService;
  let actions$: ReplaySubject<any> = new ReplaySubject(1);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: MockComponent },
          { path: 'main', component: MockComponent },
        ]),
      ],
      providers: [
        UserEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
        {
          provide: AuthenticationService,
          useClass: AuthenticationServiceMock,
        },
        {
          provide: NotificationService,
          useClass: NotificationServiceMock,
        },
        {
          provide: TokensStorageService,
          useClass: TokensStorageServiceMock,
        },
        {
          provide: Router,
          useClass: RouterMock,
        },
        {
          provide: AuthenticationTimerService,
          useClass: AuthenticationTimerServiceMock,
        },
      ],
    });

    injector = getTestBed();
    authenticationService = injector.inject(AuthenticationService);
    router = injector.inject(Router);
    notificationService = injector.inject(NotificationService);
    authenticationTimerService = injector.inject(AuthenticationTimerService);
    service = injector.inject(UserEffects);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle success register action', () => {
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');
    let resultAction: any;
    const registerSpy = spyOn(
      authenticationService,
      'register'
    ).and.returnValue(of(userFromBeMock));
    actions$.next(UserAction.REGISTER_REQUEST(userMock));

    service.register$.subscribe((action) => (resultAction = action));

    expect(registerSpy).toHaveBeenCalled();
    expect(resultAction).toEqual(UserAction.USER_UPDATE(userFromBeMock));
  });

  it('should failed register action', () => {
    let resultAction: any;
    let error: any;
    const registerSpy = spyOn(
      authenticationService,
      'register'
    ).and.returnValue(throwError('Error'));
    actions$.next(UserAction.REGISTER_REQUEST(userMock));

    service.register$.subscribe(
      (a) => (resultAction = a),
      (e) => (error = e)
    );

    expect(registerSpy).toHaveBeenCalled();
    expect(resultAction).toEqual(UserAction.USER_ERROR('Error'));
  });

  it('should handle success login action', () => {
    let resultAction: any;
    const startSpy = spyOn(authenticationTimerService, 'start');
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');
    const loginSpy = spyOn(authenticationService, 'login').and.returnValue(
      of(tokensMock)
    );
    actions$.next(
      UserAction.LOGIN_REQUEST({ username: 'username', password: 'password' })
    );

    service.login$.subscribe((action) => (resultAction = action));

    expect(startSpy).toHaveBeenCalled();
    expect(loginSpy).toHaveBeenCalled();
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/main');
    expect(resultAction).toEqual(
      TokensAction.LOGIN_REQUEST_SUCCESS(tokensMock)
    );
  });

  it('should get failed login action', () => {
    let resultAction: any;
    const errorSpy = spyOn(notificationService, 'error');
    const loginSpy = spyOn(authenticationService, 'login').and.returnValue(
      throwError('Error')
    );

    actions$.next(
      UserAction.LOGIN_REQUEST({ username: 'username', password: 'password' })
    );

    service.login$.subscribe((action) => (resultAction = action));

    expect(loginSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
    expect(resultAction).toEqual(UserAction.USER_ERROR('Error'));
  });
});
