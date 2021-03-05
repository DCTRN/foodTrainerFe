import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { getTestBed, TestBed, flush } from '@angular/core/testing';
import { User } from '@stores/user/user.model';
import { Environment } from '@core/environment';
import { AuthenticationApiService } from '@api/authentication/authentication-api.service';
import { Tokens } from '@stores/tokens/tokens.model';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { NGXLogger, LoggerConfig } from 'ngx-logger';
import {
  userMock,
  userFromBeMock,
  loginCredentialsMock,
  tokensMock,
} from './authentication-mock-data.data';

describe('AuthenticationApiService', () => {
  let injector: TestBed;
  let service: AuthenticationApiService;
  let httpTestingController: HttpTestingController;
  let logger: NGXLogger;

  const apiUrl = Environment.apiUrl;
  const registerUrl = Environment.authUrl.REGISTER;
  const loginUrl = Environment.authUrl.LOGIN;
  const refreshUrl = Environment.authUrl.REFRESH;

  beforeEach(() => {
    injector = getTestBed();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule],
      providers: [AuthenticationApiService, NGXLogger, LoggerConfig],
    });
    service = injector.inject(AuthenticationApiService);
    httpTestingController = injector.inject(HttpTestingController);
    logger = injector.inject(NGXLogger);
  });

  afterAll(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register successfuly', () => {
    let user: User;
    let error: any;

    const register$ = service.register(userMock);
    register$.subscribe(
      (u: User) => (user = u),
      (e) => (error = e)
    );
    httpTestingController
      .expectOne(`${apiUrl}${registerUrl}`)
      .flush(userFromBeMock);

    expect(register$).toBeTruthy();
    expect(user.username).toEqual(userFromBeMock.username);
    expect(error).toBeFalsy();
  });

  it('should failed to register', () => {
    let user: User;
    let error: any;
    const logSpy = spyOn(logger, 'log');

    const register$ = service.register(userMock);
    register$.subscribe(
      (u: User) => (user = u),
      (e) => (error = e)
    );
    httpTestingController
      .expectOne(`${apiUrl}${registerUrl}`)
      .error(new ErrorEvent('error'));

    expect(register$).toBeTruthy();
    expect(user).toBeFalsy();
    expect(error).toBeTruthy();
    expect(logSpy).toHaveBeenCalled();
  });

  it('should login successfuly', () => {
    let successfulData: Tokens;
    let error: any;

    const login$ = service.login(loginCredentialsMock);
    login$.subscribe(
      (t: Tokens) => (successfulData = t),
      (e) => (error = e)
    );
    httpTestingController.expectOne(`${apiUrl}${loginUrl}`).flush(tokensMock);

    expect(login$).toBeTruthy();
    expect(login$).toBeTruthy(successfulData);
    expect(error).toBeFalsy();
  });

  it('should failed to login', () => {
    let successfulData: Tokens;
    let error: any;
    const logSpy = spyOn(logger, 'log');

    const login$ = service.login(loginCredentialsMock);
    login$.subscribe(
      (t: Tokens) => (successfulData = t),
      (e) => (error = e)
    );
    httpTestingController
      .expectOne(`${apiUrl}${loginUrl}`)
      .error(new ErrorEvent('error'));

    expect(login$).toBeTruthy();
    expect(successfulData).toBeFalsy();
    expect(error).toBeTruthy();
    expect(logSpy).toHaveBeenCalled();
  });

  it('should refresh token', () => {
    let successfulData: Tokens;
    let error: any;

    const refresh$ = service.refreshToken(tokensMock.refresh_token);
    refresh$.subscribe(
      (t: Tokens) => (successfulData = t),
      (e) => (error = e)
    );
    httpTestingController.expectOne(`${apiUrl}${refreshUrl}`).flush(tokensMock);

    expect(refresh$).toBeTruthy();
    expect(successfulData).toBeTruthy();
    expect(error).toBeFalsy();
  });

  it('should refresh token', () => {
    let successfulData: Tokens;
    let error: any;
    const logSpy = spyOn(logger, 'log');

    const refresh$ = service.refreshToken(tokensMock.refresh_token);
    refresh$.subscribe(
      (t: Tokens) => (successfulData = t),
      (e) => (error = e)
    );
    httpTestingController
      .expectOne(`${apiUrl}${refreshUrl}`)
      .error(new ErrorEvent('error'));

    expect(refresh$).toBeTruthy();
    expect(successfulData).toBeFalsy();
    expect(error).toBeTruthy();
    expect(logSpy).toHaveBeenCalled();
  });
});
