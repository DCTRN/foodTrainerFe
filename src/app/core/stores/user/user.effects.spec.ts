import { HttpClientTestingModule } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject, Observable, of, throwError } from 'rxjs';
import { UserEffects } from './user.effects';
import { NGXLogger, LoggerConfig } from 'ngx-logger';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { Injectable } from '@angular/core';
import { Tokens } from '../tokens/tokens.model';
import { User } from './user.model';
import { AuthenticationService } from '../../authentication/authentication.service';
import { UserAction } from './user.actions';
import { TokensAction } from '../tokens/tokens.actions';
import {
  MatSnackBarConfig,
  MatSnackBarRef,
  TextOnlySnackBar,
  MatSnackBar,
} from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { LoginCredentials } from '@api/authentication/login-credentials.model';

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
class MatSnackBarMock {
  public open(
    message: string,
    action?: string,
    config?: MatSnackBarConfig
  ): MatSnackBarRef<TextOnlySnackBar> {
    return null;
  }
}

@Injectable()
class AuthenticationServiceMock {
  public login(credentials: LoginCredentials): Observable<Tokens> {
    return null;
  }

  public register(user: User): Observable<User> {
    return null;
  }
}

describe('User effects', () => {
  let injector: TestBed;
  let service: UserEffects;
  let authenticationService: AuthenticationService;
  let matSnackBar: MatSnackBar;
  let router: Router;
  let actions$: ReplaySubject<any> = new ReplaySubject(1);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
        RouterTestingModule,
      ],
      providers: [
        UserEffects,
        provideMockActions(() => actions$),
        NGXLogger,
        LoggerConfig,
        {
          provide: AuthenticationService,
          useClass: AuthenticationServiceMock,
        },
        {
          provide: MatSnackBar,
          useClass: MatSnackBarMock,
        },
      ],
    });

    injector = getTestBed();
    authenticationService = injector.inject(AuthenticationService);
    matSnackBar = injector.inject(MatSnackBar);
    router = injector.inject(Router);
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
    actions$.next(UserAction.REGISTER(userMock));

    service.register$.subscribe((action) => (resultAction = action));

    expect(registerSpy).toHaveBeenCalled();
    expect(resultAction).toEqual(UserAction.UPDATE(userFromBeMock));
  });

  it('should failed register action', () => {
    let resultAction: any;
    let error: any;
    const registerSpy = spyOn(
      authenticationService,
      'register'
    ).and.returnValue(throwError('Error'));
    actions$.next(UserAction.REGISTER(userMock));

    service.register$.subscribe(
      (a) => (resultAction = a),
      (e) => (error = e)
    );

    expect(registerSpy).toHaveBeenCalled();
    expect(resultAction).toEqual(UserAction.ERROR('Error'));
  });

  it('should handle success login action', () => {
    let resultAction: any;
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');
    const loginSpy = spyOn(authenticationService, 'login').and.returnValue(
      of(tokensMock)
    );
    actions$.next(
      UserAction.LOGIN({ username: 'username', password: 'password' })
    );

    service.login$.subscribe((action) => (resultAction = action));

    expect(loginSpy).toHaveBeenCalled();
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/main');
    expect(resultAction).toEqual(TokensAction.LOGIN(tokensMock));
  });

  it('should get failed login action', () => {
    let resultAction: any;
    const openSpy = spyOn(matSnackBar, 'open');
    const loginSpy = spyOn(authenticationService, 'login').and.returnValue(
      throwError('Error')
    );
   
    actions$.next(
      UserAction.LOGIN({ username: 'username', password: 'password' })
    );

    service.login$.subscribe((action) => (resultAction = action));

    expect(loginSpy).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalled();
    expect(resultAction).toEqual(UserAction.ERROR('Error'));
  });
});
