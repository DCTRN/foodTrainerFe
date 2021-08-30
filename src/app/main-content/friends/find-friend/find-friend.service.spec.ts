import { getTestBed, TestBed } from '@angular/core/testing';
import { UserApiService } from '@api/user/user-api.service';
import { ErrorFormat } from '@core/models/error-format.model';
import { NotificationService } from '@core/notifications/service/notification.service';
import { User } from '@core/stores/user/user.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { user1, user2, user3 } from '@testsUT/user/user-mock-data.model';
import { isEqual } from 'lodash';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { Observable, of, throwError } from 'rxjs';
import { FindFriendService } from './find-friend.service';

const usersMock = [user2, user3];

class UserApiServiceMock {
  public findUsersBy(searchText: string): Observable<Array<User>> {
    return of(null);
  }
}

class NotificationServiceMock {
  public info(message: string, duration: number = 5000): void {}
  public success(message: string, duration: number = 5000): void {}
  public error(message: string, duration: number = 5000): void {}
}
const userInitial: User = user1;
const initialState = { user: userInitial };
const usersMock2 = [userInitial, user1, user2, user3];

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
    expect(isEqual(users[0], user2)).toEqual(true);
    expect(isEqual(users[1], user3)).toEqual(true);
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
