import { TestBed, getTestBed } from '@angular/core/testing';
import { AuthenticationService } from './authentication.service';
import { AuthenticationApiService } from 'src/app/api/authentication/authentication-api.service';
import {
  userMock,
  userFromBeMock,
  loginCredentialsMock,
  tokensMock,
} from '../../api/authentication/authentication-mock-data.data';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { NGXLogger, LoggerConfig } from 'ngx-logger';
import { User } from '../stores/user/user.model';
import { Tokens } from '../stores/tokens/tokens.model';

describe('AuthenticationService', () => {
  let injector: TestBed;
  let service: AuthenticationService;
  let authenticationApiService: AuthenticationApiService;
  let logger: NGXLogger;

  beforeEach(() => {
    injector = getTestBed();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule],
      providers: [AuthenticationApiService, NGXLogger, LoggerConfig],
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
    const registerSpy = spyOn(
      authenticationApiService,
      'register'
    ).and.returnValue(of(userFromBeMock));

    const register$ = service.register(userMock);
    register$.subscribe(
      (u: User) => (user = u),
      (e) => (error = e)
    );

    expect(registerSpy).toHaveBeenCalled();
    expect(register$).toBeTruthy();
    expect(user.username).toEqual(userFromBeMock.username);
    expect(error).toBeFalsy();
  });

  it('should failed to register', () => {
    let error: any;
    let user: User;
    const registerSpy = spyOn(
      authenticationApiService,
      'register'
    ).and.returnValue(throwError('error'));
    const logSpy = spyOn(logger, 'log');

    const register$ = service.register(userMock);
    register$.subscribe(
      (u: User) => (user = u),
      (e) => (error = e)
    );

    expect(registerSpy).toHaveBeenCalled();
    expect(register$).toBeTruthy();
    expect(user).toBeFalsy();
    expect(error).toBeTruthy();
    expect(logSpy).toHaveBeenCalled();
  });

  it('should login successfuly', () => {
    let successfulData: Tokens;
    let error: any;
    const loginSpy = spyOn(authenticationApiService, 'login').and.returnValue(
      of(tokensMock)
    );

    const login$ = service.login(loginCredentialsMock);
    login$.subscribe(
      (t: Tokens) => (successfulData = t),
      (e) => (error = e)
    );

    expect(loginSpy).toHaveBeenCalled();
    expect(login$).toBeTruthy();
    expect(login$).toBeTruthy(successfulData);
    expect(error).toBeFalsy();
  });

  it('should failed to login', () => {
    let successfulData: Tokens;
    let error: any;
    const logSpy = spyOn(logger, 'log');
    const loginSpy = spyOn(authenticationApiService, 'login').and.returnValue(
      throwError('Error')
    );

    const login$ = service.login(loginCredentialsMock);
    login$.subscribe(
      (t: Tokens) => (successfulData = t),
      (e) => (error = e)
    );

    expect(loginSpy).toHaveBeenCalled();
    expect(login$).toBeTruthy();
    expect(successfulData).toBeFalsy();
    expect(error).toBeTruthy();
    expect(logSpy).toHaveBeenCalled();
  });

  it('should refresh token', () => {
    let successfulData: Tokens;
    let error: any;
    const refreshTokenSpy = spyOn(
      authenticationApiService,
      'refreshToken'
    ).and.returnValue(of(tokensMock));

    const refresh$ = service.refreshToken(tokensMock.refresh_token);
    refresh$.subscribe(
      (t: Tokens) => (successfulData = t),
      (e) => (error = e)
    );

    expect(refreshTokenSpy).toHaveBeenCalled();
    expect(refresh$).toBeTruthy();
    expect(successfulData).toBeTruthy();
    expect(error).toBeFalsy();
  });

  it('should refresh token', () => {
    let successfulData: Tokens;
    let error: any;
    const logSpy = spyOn(logger, 'log');
    const refreshTokenSpy = spyOn(
      authenticationApiService,
      'refreshToken'
    ).and.returnValue(throwError('Error'));

    const refresh$ = service.refreshToken(tokensMock.refresh_token);
    refresh$.subscribe(
      (t: Tokens) => (successfulData = t),
      (e) => (error = e)
    );

    expect(refreshTokenSpy).toHaveBeenCalled();
    expect(refresh$).toBeTruthy();
    expect(successfulData).toBeFalsy();
    expect(error).toBeTruthy();
    expect(logSpy).toHaveBeenCalled();
  });
});
