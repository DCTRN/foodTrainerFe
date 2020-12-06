import { getTestBed, TestBed } from '@angular/core/testing';
import { UserApiService } from '@api/user/user-api.service';
import { ErrorFormat } from '@core/models/error-format.model';
import { NotificationService } from '@core/notifications/service/notification.service';
import { User } from '@core/stores/user/user.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { isEqual } from 'lodash';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { Observable, of, throwError } from 'rxjs';
import { FindFriendService } from './find-friend.service';

const user1: User = {
  id: 66,
  username: 'mikeRandom',
  email: 'mikeRandom@gmail.com',
  birthDate: null,
  phoneNumber: '220123146',
  firstName: 'majkel',
  lastName: 'majk',
  authenticationLevel: 1,
};
const user2: User = {
  id: 3,
  username: 'mike28',
  email: 'mike28@gmail.com',
  birthDate: null,
  phoneNumber: '220123146',
  firstName: 'majkel',
  lastName: 'majk',
  authenticationLevel: 1,
};

const usersMock = [user1, user2];

class UserApiServiceMock {
  public findUsersBy(searchText: string): Observable<Array<User>> {
    return of(null);
  }
  public dupa(): void {}
}

class NotificationServiceMock {
  public info(message: string, duration: number = 5000): void {}
  public success(message: string, duration: number = 5000): void {}
  public error(message: string, duration: number = 5000): void {}
}
const userInitial: User = {
  id: 5,
  username: 'mike98',
  email: 'mmike98@gmail.com',
  birthDate: null,
  phoneNumber: '220123146',
  firstName: 'majkel',
  lastName: 'majk',
  authenticationLevel: 1,
};
const initialState = { user: userInitial };
const usersMock2 = [userInitial, user1, user2];

describe('FindFriendService', () => {
  let injector: TestBed;
  let service: FindFriendService;
  let userApiService: UserApiServiceMock;
  let notificationService: NotificationServiceMock;
  let mockStore: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoggerTestingModule],
      providers: [
        provideMockStore({ initialState }),
        { provide: UserApiService, useClass: UserApiServiceMock },
        { provide: NotificationService, useClass: NotificationServiceMock },
      ],
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    userApiService = injector.inject<UserApiServiceMock>(UserApiService as any);
    notificationService = injector.inject<NotificationServiceMock>(
      NotificationService as any
    );
    mockStore = injector.inject(MockStore);
    service = injector.inject(FindFriendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should find users by username successfully', () => {
    const searchString = 'mik';
    let users: User[] = [];
    spyOn(userApiService, 'findUsersBy').and.returnValue(of(usersMock));
    spyOn(notificationService, 'success');

    const users$ = service.findUsersBy(searchString);
    users$.subscribe((u: User[]) => (users = u));

    expect(userApiService.findUsersBy).toHaveBeenCalledWith(searchString);
    expect(users.length).toEqual(2);
    expect(isEqual(users[0], user1)).toEqual(true);
    expect(isEqual(users[1], user2)).toEqual(true);
    expect(notificationService.success).toHaveBeenCalledWith(
      `Found ${users.length} users`
    );
  });

  it('should show info notification when did not find users', () => {
    const searchString = 'mik';
    let users: User[] = [];
    spyOn(userApiService, 'findUsersBy').and.returnValue(of([]));
    spyOn(notificationService, 'info');

    const users$ = service.findUsersBy(searchString);
    users$.subscribe((u: User[]) => (users = u));

    expect(userApiService.findUsersBy).toHaveBeenCalledWith(searchString);
    expect(users.length).toEqual(0);
    expect(notificationService.info).toHaveBeenCalledWith(
      'Did not find any users'
    );
  });

  it('should filter currently logged in user from list', () => {
    const searchString = 'mik';
    let users: User[] = [];
    spyOn(userApiService, 'findUsersBy').and.returnValue(of(usersMock2));
    spyOn(notificationService, 'success');

    const users$ = service.findUsersBy(searchString);
    users$.subscribe((u: User[]) => (users = u));

    expect(userApiService.findUsersBy).toHaveBeenCalledWith(searchString);
    expect(users.length).toEqual(2);
    expect(notificationService.success).toHaveBeenCalledWith(
      `Found ${users.length} users`
    );
  });

  it('should fail to find users by username', () => {
    const searchString = 'mik';
    let users: User[] = [];
    let error: ErrorFormat;
    spyOn(userApiService, 'findUsersBy').and.returnValue(throwError('Error'));
    spyOn(notificationService, 'error');

    const users$ = service.findUsersBy(searchString);
    users$.subscribe(
      (u: User[]) => (users = u),
      (e) => (error = e)
    );

    expect(userApiService.findUsersBy).toHaveBeenCalledWith(searchString);
    expect(users.length).toEqual(0);
    expect(error).toBeFalsy();
    expect(notificationService.error).toHaveBeenCalledWith(
      'Failed to find users'
    );
  });
});
