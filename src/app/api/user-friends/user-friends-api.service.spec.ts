import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { AuthenticationApiService } from '@api/authentication/authentication-api.service';
import { Environment } from '@core/environment';
import { ErrorFormat } from '@core/models/error-format.model';
import { LoggerConfig, NGXLogger } from 'ngx-logger';
import { LoggerTestingModule } from 'ngx-logger/testing';
import {
  Friend,
  FriendRequest,
  UserFriend,
  UserFriendsApiService,
} from './user-friends-api.service';

const friendRequest: FriendRequest = {
  userId: 1,
  friendId: 2,
};

const userFriendPending: UserFriend = {
  id: 5,
  isAccepted: false,
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
  user: {
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
  friendshipAcceptDate: null,
};

const userFriendAccepted: UserFriend = {
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
  user: {
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
  friendshipAcceptDate: null,
};

const friendsMock: Array<Friend> = [
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

describe('UserFriendsApiService', () => {
  const apiUrl = Environment.apiUrl;
  const userFriendsUrl = apiUrl + Environment.userUrl.USER_FRIENDS;
  let injector: TestBed;
  let service: UserFriendsApiService;
  let httpTestingController: HttpTestingController;
  let logger: NGXLogger;

  beforeEach(() => {
    injector = getTestBed();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule],
      providers: [AuthenticationApiService, NGXLogger, LoggerConfig],
    });
    service = injector.inject(UserFriendsApiService);
    httpTestingController = injector.inject(HttpTestingController);
    logger = injector.inject(NGXLogger);
  });

  afterAll(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send friend request', () => {
    let userFriend: UserFriend;
    let error: ErrorFormat;

    service.sendFriendRequest(friendRequest).subscribe(
      (uF) => (userFriend = uF),
      (e) => (error = e)
    );

    httpTestingController
      .expectOne(`${userFriendsUrl}`)
      .flush(userFriendPending);

    expect(userFriend.id).toEqual(userFriendPending.id);
    expect(userFriend.isAccepted).toEqual(userFriendPending.isAccepted);
  });

  it('should get error while sending friend request', () => {
    let userFriend: UserFriend;
    let error: ErrorFormat;

    service.sendFriendRequest(friendRequest).subscribe(
      (uF) => (userFriend = uF),
      (e) => (error = e)
    );
    httpTestingController
      .expectOne(`${userFriendsUrl}`)
      .error(new ErrorEvent('error'));

    expect(error).toBeTruthy();
    expect(userFriend).toBeFalsy();
  });

  it('should accept friend request', () => {
    let userFriend: UserFriend;
    let error: ErrorFormat;

    service.sendFriendRequest(friendRequest).subscribe(
      (uF) => (userFriend = uF),
      (e) => (error = e)
    );

    httpTestingController
      .expectOne(`${userFriendsUrl}`)
      .flush(userFriendAccepted);

    expect(userFriend.id).toEqual(userFriendAccepted.id);
    expect(userFriend.isAccepted).toEqual(userFriendAccepted.isAccepted);
  });

  it('should get error while accepting friend request', () => {
    const userFriendQuery = '?userFriendId=';
    const userFriendRequestId = 1;
    let userFriend: UserFriend;
    let error: ErrorFormat;

    service.acceptFriendRequest(userFriendRequestId).subscribe(
      (uF) => (userFriend = uF),
      (e) => (error = e)
    );
    httpTestingController
      .expectOne(`${userFriendsUrl}${userFriendQuery}${userFriendRequestId}`)
      .error(new ErrorEvent('error'));

    expect(error).toBeTruthy();
    expect(userFriend).toBeFalsy();
  });

  it('should get all friends by user id', () => {
    const userIdQuery = '?userId=';
    const userId = 1;
    let friends: Array<Friend>;
    let error: ErrorFormat;

    service.getFriendsByUserId(userId).subscribe(
      (uF) => (friends = uF),
      (e) => (error = e)
    );

    httpTestingController
      .expectOne(`${userFriendsUrl}${userIdQuery}${userId}`)
      .flush(friendsMock);

    expect(friends.length).toEqual(1);
    expect(friends[0].id).toEqual(friendsMock[0].id);
    expect(friends[0].isAccepted).toEqual(friendsMock[0].isAccepted);
    expect(friends[0].friend.id).toEqual(friendsMock[0].friend.id);
  });

  it('should get error while getting all friends by user id', () => {
    const userIdQuery = '?userId=';
    const userId = 1;
    let friends: Array<Friend>;
    let error: ErrorFormat;

    service.getFriendsByUserId(userId).subscribe(
      (uF) => (friends = uF),
      (e) => (error = e)
    );
    httpTestingController
      .expectOne(`${userFriendsUrl}${userIdQuery}${userId}`)
      .error(new ErrorEvent('error'));

    expect(error).toBeTruthy();
    expect(friends).toBeFalsy();
  });

  it('should successfully delete userFriend', () => {
    const userIdQuery = '?userFriendId=';
    const userFriendId = 1;
    let resp: Object;
    let error: ErrorFormat;

    service.deleteFriendById(userFriendId).subscribe(
      (uF) => (resp = uF),
      (e) => (error = e)
    );

    httpTestingController
      .expectOne(`${userFriendsUrl}${userIdQuery}${userFriendId}`)
      .flush(friendsMock);

    expect(resp).toBeTruthy();
    expect(error).toBeFalsy();
  });

  it('should get error while deleting userFriend', () => {
    const userIdQuery = '?userFriendId=';
    const userFriendId = 1;
    let resp: Object;
    let error: ErrorFormat;

    service.deleteFriendById(userFriendId).subscribe(
      (r) => (resp = r),
      (e) => (error = e)
    );
    httpTestingController
      .expectOne(`${userFriendsUrl}${userIdQuery}${userFriendId}`)
      .error(new ErrorEvent('error'));

    expect(error).toBeTruthy();
    expect(resp).toBeFalsy();
  });
});
