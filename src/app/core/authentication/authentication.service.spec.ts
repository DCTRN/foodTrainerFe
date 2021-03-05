import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { AuthenticationApiService } from '@api/authentication/authentication-api.service';
import {
  loginCredentialsMock,
  tokensMock,
  userFromBeMock,
  userMock,
} from '@api/authentication/authentication-mock-data.data';
import { ErrorFormat } from '@core/models/error-format.model';
import { Tokens } from '@stores/tokens/tokens.model';
import { User } from '@stores/user/user.model';
import { LoggerConfig, NGXLogger } from 'ngx-logger';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { of, throwError } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { TokensStorageService } from './tokens-storage.service';

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

describe('AuthenticationService', () => {
  let injector: TestBed;
  let service: AuthenticationService;
  let authenticationApiService: AuthenticationApiService;
  let logger: NGXLogger;

  beforeEach(() => {
    injector = getTestBed();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule],
      providers: [
        AuthenticationApiService,
        NGXLogger,
        LoggerConfig,
        {
          provide: TokensStorageService,
          useClass: TokensStorageServiceMock,
        },
      ],
    });
    service = injector.inject(AuthenticationService);
    authenticationApiService = injector.inject(AuthenticationApiService);
    logger = injector.inject(NGXLogger);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register successfuly', () => {
    let user: User;
    let error: any;
    let registerError: ErrorFormat;
    const registerSpy = spyOn(
      authenticationApiService,
      'register'
    ).and.returnValue(of(userFromBeMock));

    const register$ = service.register(userMock);
    register$.subscribe(
      (u: User) => (user = u),
      (e) => (error = e)
    );
    service
      .getRegisterError$()
      .subscribe((error: ErrorFormat) => (registerError = error));

    expect(registerError).toEqual(null);
    expect(registerSpy).toHaveBeenCalled();
    expect(register$).toBeTruthy();
    expect(user.username).toEqual(userFromBeMock.username);
    expect(error).toBeFalsy();
  });

  it('should failed to register', () => {
    let error: any;
    let user: User;
    let registerError: ErrorFormat;
    const registerSpy = spyOn(
      authenticationApiService,
      'register'
    ).and.returnValue(
      throwError({
        error: 'db.constraint',
        errorDescription: 'Username must be unique',
      })
    );
    const logSpy = spyOn(logger, 'log');

    const register$ = service.register(userMock);
    register$.subscribe(
      (u: User) => (user = u),
      (e) => (error = e)
    );
    service
      .getRegisterError$()
      .subscribe((error: ErrorFormat) => (registerError = error));

    expect(registerError.errorDescription).toEqual('Username must be unique');
    expect(registerSpy).toHaveBeenCalled();
    expect(register$).toBeTruthy();
    expect(user).toBeFalsy();
    expect(error).toBeTruthy();
    expect(logSpy).toHaveBeenCalled();
  });

  it('should login successfuly', () => {
    let successfulData: Tokens;
    let error: any;
    let authState = false;
    const loginSpy = spyOn(authenticationApiService, 'login').and.returnValue(
      of(tokensMock)
    );

    service.getAuthState$().subscribe((s) => (authState = s));
    const login$ = service.login(loginCredentialsMock);

    expect(service.isAuthOperationInProgress()).toBeTruthy();

    login$.subscribe(
      (t: Tokens) => (successfulData = t),
      (e) => (error = e)
    );

    expect(authState).toEqual(true);
    expect(service.isAuthOperationInProgress()).toBeFalsy();
    expect(loginSpy).toHaveBeenCalled();
    expect(login$).toBeTruthy();
    expect(login$).toBeTruthy(successfulData);
    expect(error).toBeFalsy();
  });

  it('should failed to login', () => {
    let successfulData: Tokens;
    let error: any;
    let authState = false;
    const logSpy = spyOn(logger, 'log');
    const loginSpy = spyOn(authenticationApiService, 'login').and.returnValue(
      throwError('Error')
    );

    service.getAuthState$().subscribe((s) => (authState = s));
    const login$ = service.login(loginCredentialsMock);

    expect(service.isAuthOperationInProgress()).toBeTruthy();

    login$.subscribe(
      (t: Tokens) => (successfulData = t),
      (e) => (error = e)
    );

    expect(authState).toEqual(false);
    expect(service.isAuthOperationInProgress()).toBeFalsy();
    expect(loginSpy).toHaveBeenCalled();
    expect(login$).toBeTruthy();
    expect(successfulData).toBeFalsy();
    expect(error).toBeTruthy();
    expect(logSpy).toHaveBeenCalled();
  });

  it('should refresh token', () => {
    let successfulData: Tokens;
    let error: any;
    let authState = false;
    const refreshTokenSpy = spyOn(
      authenticationApiService,
      'refreshToken'
    ).and.returnValue(of(tokensMock));

    service.getAuthState$().subscribe((s) => (authState = s));
    const refresh$ = service.refreshToken();

    expect(service.isAuthOperationInProgress()).toBeTruthy();

    refresh$.subscribe(
      (t: Tokens) => (successfulData = t),
      (e) => (error = e)
    );

    expect(authState).toEqual(true);
    expect(service.isAuthOperationInProgress()).toBeFalsy();
    expect(refreshTokenSpy).toHaveBeenCalled();
    expect(refresh$).toBeTruthy();
    expect(successfulData).toBeTruthy();
    expect(error).toBeFalsy();
  });

  it('should fail to refresh token', () => {
    let successfulData: Tokens;
    let error: any;
    let authState = false;
    const logSpy = spyOn(logger, 'log');
    const refreshTokenSpy = spyOn(
      authenticationApiService,
      'refreshToken'
    ).and.returnValue(throwError('Error'));

    service.getAuthState$().subscribe((s) => (authState = s));
    const refresh$ = service.refreshToken();

    expect(service.isAuthOperationInProgress()).toBeTruthy();

    refresh$.subscribe(
      (t: Tokens) => (successfulData = t),
      (e) => (error = e)
    );

    expect(authState).toEqual(false);
    expect(service.isAuthOperationInProgress()).toBeFalsy();
    expect(refreshTokenSpy).toHaveBeenCalled();
    expect(refresh$).toBeTruthy();
    expect(successfulData).toBeFalsy();
    expect(error).toBeTruthy();
    expect(logSpy).toHaveBeenCalled();
  });

  it('should log authState changes', () => {
    const logSpy = spyOn(logger, 'log');
    spyOn(authenticationApiService, 'login').and.returnValue(of(tokensMock));

    const login$ = service.login(loginCredentialsMock);
    login$.subscribe();

    expect(logSpy).toHaveBeenCalledWith(`[AUTH.S] Auth state changed: true`);
  });
});
