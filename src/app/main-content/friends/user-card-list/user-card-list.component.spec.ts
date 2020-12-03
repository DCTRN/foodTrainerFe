import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { Friends, FriendsAction } from '@core/stores/friends/friends.actions';
import { Friend } from '@core/stores/friends/friends.model';
import { UserAction } from '@core/stores/user/user.actions';
import { User } from '@core/stores/user/user.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { isEqual } from 'lodash';
import { ListType, UserCardListComponent } from './user-card-list.component';

const randomUser: User = {
  id: 66,
  username: 'mikeRandom',
  email: 'mikeRandom@gmail.com',
  birthDate: null,
  phoneNumber: '220123146',
  firstName: 'majkel',
  lastName: 'majk',
  authenticationLevel: 1,
};
const userAccepted: User = {
  id: 3,
  username: 'mike28',
  email: 'mike28@gmail.com',
  birthDate: null,
  phoneNumber: '220123146',
  firstName: 'majkel',
  lastName: 'majk',
  authenticationLevel: 1,
};
const userSent: User = {
  id: 2,
  username: 'mike2',
  email: 'mike2@gmail.com',
  birthDate: null,
  phoneNumber: '223123146',
  firstName: 'majkel',
  lastName: 'majk',
  authenticationLevel: 1,
};
const userReceived: User = {
  id: 1,
  username: 'mike1',
  email: 'mike1@gmail.com',
  birthDate: null,
  phoneNumber: '123123146',
  firstName: 'majkel',
  lastName: 'majk',
  authenticationLevel: 1,
};

const randomFriend: Friend = {
  id: 8,
  isAccepted: true,
  friend: randomUser,
  friendshipRequesterId: 5,
  friendshipRequestDate: null,
  friendshipAcceptDate: null,
};
const friendReceived = {
  id: 6,
  isAccepted: false,
  friend: userReceived,
  friendshipRequesterId: 1,
  friendshipRequestDate: null,
  friendshipAcceptDate: null,
};
const friendSent = {
  id: 7,
  isAccepted: false,
  friend: userSent,
  friendshipRequesterId: 5,
  friendshipRequestDate: null,
  friendshipAcceptDate: null,
};
const friendAccepted = {
  id: 8,
  isAccepted: true,
  friend: userAccepted,
  friendshipRequesterId: 5,
  friendshipRequestDate: null,
  friendshipAcceptDate: null,
};
const friendsInitial: Friends = {
  friends: [friendReceived, friendSent, friendAccepted],
};

const userInitial: User = {
  username: 'mike8',
  email: 'michal.kowalski@gmail.com',
  phoneNumber: '123123123',
  birthDate: new Date(),
  firstName: 'majkel',
  lastName: 'majk',
  id: 5,
  authenticationLevel: 1,
};
export const initialState: any = {
  user: userInitial,
  friends: friendsInitial,
};

describe('UserCardListComponent', () => {
  let injector: TestBed;
  let component: UserCardListComponent;
  let fixture: ComponentFixture<UserCardListComponent>;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserCardListComponent],
      providers: [provideMockStore({ initialState })],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    store = injector.inject(MockStore);
    fixture = TestBed.createComponent(UserCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get user credentials on init', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith(
      FriendsAction.GET_ALL_FRIENDS_REQUEST()
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      UserAction.GET_CREDENTIALS_REQUEST()
    );
  });

  it('should display user friends', () => {
    const friends = component.getFriends();

    expect(friends.length).toEqual(1);
    expect(isEqual(friends[0].friend, userAccepted)).toBeTruthy();
  });

  it('should display user friend requests sent', () => {
    const friends = component.getSentFriendRequest();

    expect(friends.length).toEqual(1);
    expect(isEqual(friends[0].friend, userSent)).toBeTruthy();
  });

  it('should display user friend requests received', () => {
    const friends = component.getReceivedFriendRequest();

    expect(friends.length).toEqual(1);
    expect(isEqual(friends[0].friend, userReceived)).toBeTruthy();
  });

  it('should get appropriate list type', () => {
    const entryData = [
      randomFriend,
      friendAccepted,
      friendReceived,
      friendSent,
    ];
    const expectations = [
      ListType.ALL_USERS,
      ListType.FRIENDS,
      ListType.FRIEND_REQUEST_RECEIVED,
      ListType.FRIEND_REQUEST_SENT,
    ];
    entryData.map((u, i) => {
      const t = component.generateListType(u.friend);
      expect(t).toEqual(expectations[i]);
    });
  });
});
