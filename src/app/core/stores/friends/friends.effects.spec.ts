import { getTestBed, TestBed } from '@angular/core/testing';
import { UserFriendsApiService } from '@api/user-friends/user-friends-api.service';
import { NotificationService } from '@core/notifications/service/notification.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { Observable, of, throwError } from 'rxjs';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { User } from '../user/user.model';
import { FriendsAction } from './friends.actions';
import { FriendsEffects } from './friends.effects';
import { Friend, FriendRequest, UserFriend } from './friends.model';

const userInitial: User = {
  id: 1,
  username: 'mike',
  email: 'mike@gmail.com',
  birthDate: new Date(),
  phoneNumber: '223153146',
  firstName: 'majkel',
  lastName: 'majk',
  authenticationLevel: 1,
};

const friendsInitial: Friend[] = [
  {
    id: 5,
    isAccepted: true,
    friend: {
      id: 2,
      username: 'mike2',
      email: 'mike2@gmail.com',
      birthDate: new Date(),
      phoneNumber: '223123146',
      firstName: 'majkel',
      lastName: 'majk',
      authenticationLevel: 1,
    },
    friendshipRequesterId: 1,
    friendshipRequestDate: new Date(),
    friendshipAcceptDate: new Date(),
  },
];
const initialState = { friends: friendsInitial, user: userInitial };

const userFriend: UserFriend = {
  id: 5,
  isAccepted: true,
  user: userInitial,
  friend: {
    id: 2,
    username: 'mike2',
    email: 'mike2@gmail.com',
    birthDate: new Date(),
    phoneNumber: '223123146',
    firstName: 'majkel',
    lastName: 'majk',
    authenticationLevel: 1,
  },
  friendshipRequesterId: 1,
  friendshipRequestDate: new Date(),
  friendshipAcceptDate: new Date(),
};

const userFriendAccepted: UserFriend = {
  id: 5,
  isAccepted: true,
  user: userInitial,
  friend: {
    id: 2,
    username: 'mike2',
    email: 'mike2@gmail.com',
    birthDate: new Date(),
    phoneNumber: '223123146',
    firstName: 'majkel',
    lastName: 'majk',
    authenticationLevel: 1,
  },
  friendshipRequesterId: 1,
  friendshipRequestDate: new Date(),
  friendshipAcceptDate: new Date(),
};

const friend: Friend = {
  id: userFriend.id,
  isAccepted: userFriend.isAccepted,
  friend: userFriend.friend,
  friendshipRequesterId: userFriend.friendshipRequesterId,
  friendshipRequestDate: userFriend.friendshipRequestDate,
  friendshipAcceptDate: userFriend.friendshipAcceptDate,
};

class NotificationServiceMock {
  public success(message: string, duration: number = 5000): void {}
  public error(message: string, duration: number = 5000): void {}
}

export class UserFriendsApiServiceMock {
  public sendFriendRequest(
    friendRequest: FriendRequest
  ): Observable<UserFriend> {
    return of(null);
  }
  public acceptFriendRequest(userFriendId: number): Observable<UserFriend> {
    return of(null);
  }
  public getFriendsByUserId(userId: number): Observable<Array<Friend>> {
    return of(null);
  }
  public deleteFriendById(userFriendId: number): Observable<Object> {
    return of(null);
  }
}

describe('FriendsEffects', () => {
  let injector: TestBed;
  let actions$ = new ReplaySubject(1);
  let service: FriendsEffects;
  let notificationService: NotificationService;
  let userFriendsApiService: UserFriendsApiService;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoggerTestingModule],
      providers: [
        FriendsEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
        {
          provide: NotificationService,
          useClass: NotificationServiceMock,
        },
        {
          provide: UserFriendsApiService,
          useClass: UserFriendsApiServiceMock,
        },
      ],
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    store = injector.inject(MockStore);
    notificationService = injector.inject(NotificationService);
    userFriendsApiService = injector.inject(UserFriendsApiService);
    service = injector.inject(FriendsEffects);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fail to get all friends', () => {
    let resultAction: any;
    const getFriendsByUserIdSpy = spyOn(
      userFriendsApiService,
      'getFriendsByUserId'
    ).and.returnValue(throwError('Error'));

    const errorSpy = spyOn(notificationService, 'error');

    actions$.next(FriendsAction.GET_ALL_FRIENDS_REQUEST());
    service.getAllFriends$.subscribe((action) => (resultAction = action));

    expect(getFriendsByUserIdSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
    expect(resultAction).toEqual(FriendsAction.GET_ALL_FRIENDS_REQUEST_ERROR());
  });

  it('should get all friends successfully', () => {
    let resultAction: any;
    const getFriendsByUserIdSpy = spyOn(
      userFriendsApiService,
      'getFriendsByUserId'
    ).and.returnValue(of(friendsInitial));

    const errorSpy = spyOn(notificationService, 'error');

    actions$.next(FriendsAction.GET_ALL_FRIENDS_REQUEST());
    service.getAllFriends$.subscribe((action) => (resultAction = action));

    expect(getFriendsByUserIdSpy).toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
    expect(resultAction).toEqual(
      FriendsAction.GET_ALL_FRIENDS_REQUEST_SUCCESS({ friends: friendsInitial })
    );
  });

  it('should fail to send friend request', () => {
    let resultAction: any;
    const sendFriendRequestSpy = spyOn(
      userFriendsApiService,
      'sendFriendRequest'
    ).and.returnValue(throwError('Error'));

    const errorSpy = spyOn(notificationService, 'error');

    actions$.next(FriendsAction.SEND_FRIEND_REQUEST({ id: 1 }));
    service.sendFriendRequest$.subscribe((action) => (resultAction = action));

    expect(sendFriendRequestSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
    expect(resultAction).toEqual(FriendsAction.SEND_FRIEND_REQUEST_ERROR());
  });

  it('should send friend request successfully', () => {
    let resultAction: any;
    const sendFriendRequestSpy = spyOn(
      userFriendsApiService,
      'sendFriendRequest'
    ).and.returnValue(of(userFriend));

    const errorSpy = spyOn(notificationService, 'error');

    actions$.next(FriendsAction.SEND_FRIEND_REQUEST({ id: 1 }));
    service.sendFriendRequest$.subscribe((action) => (resultAction = action));

    expect(sendFriendRequestSpy).toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
    expect(resultAction).toEqual(
      FriendsAction.SEND_FRIEND_REQUEST_SUCCESS({
        friend,
      })
    );
  });

  it('should fail to accept friend request', () => {
    let resultAction: any;
    const acceptFriendRequestSpy = spyOn(
      userFriendsApiService,
      'acceptFriendRequest'
    ).and.returnValue(throwError('Error'));

    const errorSpy = spyOn(notificationService, 'error');

    actions$.next(FriendsAction.ACCEPT_FRIEND_REQUEST({ id: 1 }));
    service.acceptFriendRequest$.subscribe((action) => (resultAction = action));

    expect(acceptFriendRequestSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
    expect(resultAction).toEqual(FriendsAction.ACCEPT_FRIEND_REQUEST_ERROR());
  });

  it('should accept friend request successfully', () => {
    let resultAction: any;
    const acceptFriendRequestSpy = spyOn(
      userFriendsApiService,
      'acceptFriendRequest'
    ).and.returnValue(of(userFriendAccepted));

    const errorSpy = spyOn(notificationService, 'error');

    actions$.next(FriendsAction.ACCEPT_FRIEND_REQUEST({ id: 1 }));
    service.acceptFriendRequest$.subscribe((action) => (resultAction = action));

    expect(acceptFriendRequestSpy).toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
    expect(resultAction).toEqual(
      FriendsAction.ACCEPT_FRIEND_REQUEST_SUCCESS({
        friend,
      })
    );
  });

  it('should fail to delete friend', () => {
    let resultAction: any;
    const deleteFriendByIdSpy = spyOn(
      userFriendsApiService,
      'deleteFriendById'
    ).and.returnValue(throwError('Error'));

    const errorSpy = spyOn(notificationService, 'error');

    actions$.next(FriendsAction.DELETE_FRIEND_REQUEST({ id: 1 }));
    service.deleteFriendRequest$.subscribe((action) => (resultAction = action));

    expect(deleteFriendByIdSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
    expect(resultAction).toEqual(FriendsAction.DELETE_FRIEND_REQUEST_ERROR());
  });

  it('should delete friend successfully', () => {
    let resultAction: any;
    const deleteFriendByIdSpy = spyOn(
      userFriendsApiService,
      'deleteFriendById'
    ).and.returnValue(of({}));

    const errorSpy = spyOn(notificationService, 'error');

    actions$.next(FriendsAction.DELETE_FRIEND_REQUEST({ id: 1 }));
    service.deleteFriendRequest$.subscribe((action) => (resultAction = action));

    expect(deleteFriendByIdSpy).toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
    expect(resultAction).toEqual(
      FriendsAction.DELETE_FRIEND_REQUEST_SUCCESS({ id: 1 })
    );
  });
});
