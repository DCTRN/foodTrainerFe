import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Injectable } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginCredentials } from '@api/authentication/login-credentials.model';
import { UserApiService } from '@api/user/user-api.service';
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
  private username = 'username';

  constructor() {}

  public setTokens(tokens: Tokens): void {
    this.tokens = tokens;
  }

  public getTokens(): Tokens {
    return this.tokens;
  }

  public setUsername(username: string): void {
    this.username = username;
  }

  public getUsername(): string {
    return this.username;
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

export class UserApiServiceMock {
  public getUserCredentialsByUsername(username: string): Observable<User> {
    return of(null);
  }
  public findUsersBy(searchText: string): Observable<Array<User>> {
    return of(null);
  }
  public updateUserCredentials(user: User): Observable<User> {
    return of(null);
  }
}

const userMock1 = {
  id: 5,
  username: 'mike98',
  email: 'mike98@gmail.com',
  birthDate: new Date(),
  phoneNumber: '111222333',
  firstName: 'firstName',
  lastName: 'lastName',
  authenticationLevel: 1,
};

describe('User effects', () => {
  let injector: TestBed;
  let service: UserEffects;
  let authenticationService: AuthenticationService;
  let router: Router;
  let notificationService: NotificationService;
  let authenticationTimerService: AuthenticationTimerService;
  let userApiService: UserApiService;
  let tokensStorageService: TokensStorageService;
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
        {
          provide: UserApiService,
          useClass: UserApiServiceMock,
        },
      ],
    });

    injector = getTestBed();
    authenticationService = injector.inject(AuthenticationService);
    router = injector.inject(Router);
    notificationService = injector.inject(NotificationService);
    authenticationTimerService = injector.inject(AuthenticationTimerService);
    userApiService = injector.inject(UserApiService);
    tokensStorageService = injector.inject(TokensStorageService);
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
    const setUsernameSpy = spyOn(tokensStorageService, 'setUsername');
    const setTokensSpy = spyOn(tokensStorageService, 'setTokens');
    const loginSpy = spyOn(authenticationService, 'login').and.returnValue(
      of(tokensMock)
    );
    actions$.next(
      UserAction.LOGIN_REQUEST({ username: 'username', password: 'password' })
    );

    service.login$.subscribe((action) => (resultAction = action));

    expect(startSpy).toHaveBeenCalled();
    expect(loginSpy).toHaveBeenCalled();
    expect(setUsernameSpy).toHaveBeenCalled();
    expect(setTokensSpy).toHaveBeenCalled();
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

  it('should make get user credentials request', () => {
    let resultAction: any;
    const getUserCredentialsByUsernameSpy = spyOn(
      userApiService,
      'getUserCredentialsByUsername'
    ).and.returnValue(of(userMock1));

    actions$.next(UserAction.GET_CREDENTIALS_REQUEST());

    service.getCredentials$.subscribe((action) => (resultAction = action));

    expect(getUserCredentialsByUsernameSpy).toHaveBeenCalled();
    expect(resultAction).toEqual(UserAction.USER_UPDATE(userMock1));
  });

  it('should fail to get user credentials', () => {
    let resultAction: any;
    const errorSpy = spyOn(notificationService, 'error');
    const getUserCredentialsByUsernameSpy = spyOn(
      userApiService,
      'getUserCredentialsByUsername'
    ).and.returnValue(throwError('Error'));

    actions$.next(UserAction.GET_CREDENTIALS_REQUEST());

    service.getCredentials$.subscribe((action) => (resultAction = action));

    expect(getUserCredentialsByUsernameSpy).toHaveBeenCalled();
    expect(resultAction).toEqual(UserAction.USER_ERROR('Error'));
    expect(errorSpy).toHaveBeenCalled();
  });

  it('should make user patch credentials request', () => {
    let resultAction: any;
    const updateUserCredentialsSpy = spyOn(
      userApiService,
      'updateUserCredentials'
    ).and.returnValue(of(userMock1));

    actions$.next(UserAction.PATCH_CREDENTIALS_REQUEST(userMock1));

    service.patchCredentials$.subscribe((action) => (resultAction = action));

    expect(updateUserCredentialsSpy).toHaveBeenCalled();
    expect(resultAction).toEqual(UserAction.USER_UPDATE(userMock1));
  });

  it('should fail to patch user credentials', () => {
    let resultAction: any;
    const errorSpy = spyOn(notificationService, 'error');
    const updateUserCredentialsSpy = spyOn(
      userApiService,
      'updateUserCredentials'
    ).and.returnValue(throwError('Error'));

    actions$.next(UserAction.PATCH_CREDENTIALS_REQUEST(userMock1));

    service.patchCredentials$.subscribe((action) => (resultAction = action));

    expect(updateUserCredentialsSpy).toHaveBeenCalled();
    expect(resultAction).toEqual(UserAction.USER_ERROR('Error'));
    expect(errorSpy).toHaveBeenCalled();
  });
});
