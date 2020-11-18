import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { AuthenticationApiService } from '@api/authentication/authentication-api.service';
import { Environment } from '@core/environment';
import { ErrorFormat } from '@core/models/error-format.model';
import { User } from '@core/stores/user/user.model';
import { LoggerConfig, NGXLogger } from 'ngx-logger';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { UserApiService } from './user-api.service';

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

const userMock2 = {
  id: 1,
  username: 'mike1',
  email: 'mike1@gmail.com',
  birthDate: new Date(),
  phoneNumber: '123123146',
  firstName: 'majkel',
  lastName: 'majk',
  authenticationLevel: 1,
};
const userMock3 = {
  id: 2,
  username: 'mike2',
  email: 'mike2@gmail.com',
  birthDate: new Date(),
  phoneNumber: '223123146',
  firstName: 'majkel',
  lastName: 'majk',
  authenticationLevel: 1,
};
const findByMock: Array<User> = [userMock1, userMock2, userMock3];

const userMockData: Array<User> = [userMock1];

describe('UserApiService', () => {
  const apiUrl = Environment.apiUrl;
  const usersUrl = apiUrl + Environment.userUrl;
  let injector: TestBed;
  let service: UserApiService;
  let httpTestingController: HttpTestingController;
  let logger: NGXLogger;

  beforeEach(() => {
    injector = getTestBed();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule],
      providers: [AuthenticationApiService, NGXLogger, LoggerConfig],
    });
    service = injector.inject(UserApiService);
    httpTestingController = injector.inject(HttpTestingController);
    logger = injector.inject(NGXLogger);
  });

  afterAll(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user data successfully', () => {
    const username = 'username';
    let user: User;
    let error: ErrorFormat;

    service.getUserCredentialsByUsername(username).subscribe(
      (u) => (user = u),
      (e) => (error = e)
    );

    httpTestingController
      .expectOne(`${usersUrl}?username=${username}`)
      .flush(userMockData);

    expect(user.id).toEqual(userMock1.id);
    expect(user.username).toEqual(userMock1.username);
    expect(user.email).toEqual(userMock1.email);
    expect(user.phoneNumber).toEqual(userMock1.phoneNumber);
    expect(user.firstName).toEqual(userMock1.firstName);
    expect(user.lastName).toEqual(userMock1.lastName);
    expect(user.authenticationLevel).toEqual(userMock1.authenticationLevel);
  });

  it('should get empty user data successfully', () => {
    const username = 'username';
    let user: User;
    let error: ErrorFormat;

    service.getUserCredentialsByUsername(username).subscribe(
      (u) => (user = u),
      (e) => (error = e)
    );

    httpTestingController
      .expectOne(`${usersUrl}?username=${username}`)
      .flush([]);

    expect(user.id).toEqual(null);
    expect(user.username).toEqual(null);
    expect(user.email).toEqual(null);
    expect(user.phoneNumber).toEqual(null);
    expect(user.firstName).toEqual(null);
    expect(user.lastName).toEqual(null);
    expect(user.authenticationLevel).toEqual(null);
  });

  it('should get error while fetching user data', () => {
    const username = 'username';
    let user: User;
    let error: ErrorFormat;

    service.getUserCredentialsByUsername(username).subscribe(
      (u) => (user = u),
      (e) => (error = e)
    );

    httpTestingController
      .expectOne(`${usersUrl}?username=${username}`)
      .error(new ErrorEvent('error'));

    expect(error).toBeTruthy();
    expect(user).toBeFalsy();
  });

  it('should update user credentials', () => {
    let user: User;
    let error: ErrorFormat;

    service.updateUserCredentials(userMock1).subscribe(
      (u) => (user = u),
      (e) => (error = e)
    );

    httpTestingController
      .expectOne(`${usersUrl}/${userMock1.id}`)
      .flush(userMock1);

    expect(user.id).toEqual(userMock1.id);
    expect(user.username).toEqual(userMock1.username);
    expect(user.email).toEqual(userMock1.email);
    expect(user.phoneNumber).toEqual(userMock1.phoneNumber);
    expect(user.firstName).toEqual(userMock1.firstName);
    expect(user.lastName).toEqual(userMock1.lastName);
    expect(user.authenticationLevel).toEqual(userMock1.authenticationLevel);
  });

  it('should get error while updating user data', () => {
    let user: User;
    let error: ErrorFormat;

    service.updateUserCredentials(userMock1).subscribe(
      (u) => (user = u),
      (e) => (error = e)
    );

    httpTestingController
      .expectOne(`${usersUrl}/${userMock1.id}`)
      .error(new ErrorEvent('error'));

    expect(error).toBeTruthy();
    expect(user).toBeFalsy();
  });

  it('should find users by text predicate', () => {
    const findBy = '?findBy=';
    let user: User[];
    let error: ErrorFormat;

    const textPredicate = 'k';
    service.findUsersBy(textPredicate).subscribe(
      (u) => (user = u),
      (e) => (error = e)
    );

    httpTestingController
      .expectOne(`${usersUrl}${findBy}${textPredicate}`)
      .flush(findByMock);

    expect(user.length).toEqual(findByMock.length);
  });

  it('should get error while finding users by some text', () => {
    const findBy = '?findBy=';
    let user: User[];
    let error: ErrorFormat;

    const textPredicate = 'k';
    service.findUsersBy(textPredicate).subscribe(
      (u) => (user = u),
      (e) => (error = e)
    );

    httpTestingController
      .expectOne(`${usersUrl}${findBy}${textPredicate}`)
      .error(new ErrorEvent('error'));

    expect(error).toBeTruthy();
    expect(user).toBeFalsy();
  });
});
