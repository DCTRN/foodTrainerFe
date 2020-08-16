import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { User } from 'src/app/core/ngrx/stores/user/user.model';
import { Environment } from '../../core/environment';
import {
  AuthenticationApiService,
  LoginCredentials,
  Tokens,
} from './authentication-api.service';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { NGXLogger, LoggerConfig } from 'ngx-logger';

const loginCredentialsMock: LoginCredentials = {
  username: 'mike8',
  password: 'haslo1234',
};

const userMock: User = {
  username: 'mike8',
  password: 'haslo1234',
  email: 'michal.kowalski@gmail.com',
  phoneNumber: '123123123',
  birthDate: null,
  firstName: 'majkel',
  lastName: 'majk',
};

const userFromBeMock: User = {
  username: 'mike8',
  email: 'michal.kowalski@gmail.com',
  birthDate: null,
  phoneNumber: '123123123',
  firstName: 'majkel',
  lastName: 'majk',
  id: 22,
  authenticationLevel: 1,
};

const loginMock = {
  access_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1pa2UxMjMiLCJwYXNzd29yZCI6Imhhc2xvMTIzNCIsImlhdCI6MTU5NzU4MTgyMywiZXhwIjoxNTk3NTgyMTIzfQ.9wAi_LmInRynGftD1Ql8FiYh5eB3DLcSFSXRzawTXKk',
  refresh_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1pa2UxMjMiLCJwYXNzd29yZCI6Imhhc2xvMTIzNCIsImlhdCI6MTU5NzU4MTgyMywiZXhwIjoxNjAwMTczODIzfQ.tT3JfnXm56Z-EnixMk4tmbfqRyAn2RGEjGyD7DDjUUg',
  expires_in: 300,
};

fdescribe('AuthenticationApiService', () => {
  let injector: TestBed;
  let service: AuthenticationApiService;
  let httpTestingController: HttpTestingController;
  let logger: NGXLogger;

  const apiUrl = Environment.apiUrl;
  const registerUrl = Environment.authUrl.REGISTER;
  const loginUrl = Environment.authUrl.LOGIN;

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
  });

  it('should login successfuly', () => {
    const login$ = service.login(loginCredentialsMock);
    let successfulData: Tokens;
    let error: any;

    login$.subscribe(
      (t: Tokens) => (successfulData = t),
      (e) => (error = e)
    );
    httpTestingController.expectOne(`${apiUrl}${loginUrl}`).flush(loginMock);
    expect(login$).toBeTruthy();
    expect(login$).toBeTruthy(successfulData);
    expect(error).toBeFalsy();
  });

  it('should failed to login', () => {
    const login$ = service.login(loginCredentialsMock);
    let successfulData: Tokens;
    let error: any;

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
  });
});
