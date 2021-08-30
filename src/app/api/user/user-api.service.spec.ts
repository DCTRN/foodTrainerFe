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
import { user1, user2, user3 } from '@testsUT/user/user-mock-data.model';

const findByMock: Array<User> = [user1, user2, user3];
const userMockData: Array<User> = [user1];

describe('UserApiService', () => {
  const apiUrl = Environment.apiUrl;
  const usersUrl = apiUrl + Environment.userUrl.USERS;
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

    expect(user.id).toEqual(user1.id);
    expect(user.username).toEqual(user1.username);
    expect(user.email).toEqual(user1.email);
    expect(user.phoneNumber).toEqual(user1.phoneNumber);
    expect(user.firstName).toEqual(user1.firstName);
    expect(user.lastName).toEqual(user1.lastName);
    expect(user.authenticationLevel).toEqual(user1.authenticationLevel);
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

    service.updateUserCredentials(user1).subscribe(
      (u) => (user = u),
      (e) => (error = e)
    );

    httpTestingController.expectOne(`${usersUrl}/${user1.id}`).flush(user1);

    expect(user.id).toEqual(user1.id);
    expect(user.username).toEqual(user1.username);
    expect(user.email).toEqual(user1.email);
    expect(user.phoneNumber).toEqual(user1.phoneNumber);
    expect(user.firstName).toEqual(user1.firstName);
    expect(user.lastName).toEqual(user1.lastName);
    expect(user.authenticationLevel).toEqual(user1.authenticationLevel);
  });

  it('should get error while updating user data', () => {
    let user: User;
    let error: ErrorFormat;

    service.updateUserCredentials(user1).subscribe(
      (u) => (user = u),
      (e) => (error = e)
    );

    httpTestingController
      .expectOne(`${usersUrl}/${user1.id}`)
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
