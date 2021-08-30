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
import {
  user1,
  user2,
  user3,
  user4,
  user5,
} from '@testsUT/user/user-mock-data.model';
import { isEqual } from 'lodash';
import {
  ListType,
  UserCardButtonListAction,
  UserCardListComponent,
} from './user-card-list.component';
import {
  UserCardButtonAction,
  UserCardButtonActionType,
} from './user-card/user-card.component';

const randomUser: User = user5;
const userAccepted: User = user4;
const userSent: User = user3;
const userReceived: User = user2;

const randomFriend: Friend = {
  id: 8,
  isAccepted: true,
  friend: randomUser,
  friendshipRequesterId: randomUser.id,
  friendshipRequestDate: null,
  friendshipAcceptDate: null,
};
const friendReceived = {
  id: 6,
  isAccepted: false,
  friend: userReceived,
  friendshipRequesterId: userReceived.id,
  friendshipRequestDate: null,
  friendshipAcceptDate: null,
};
const friendSent = {
  id: 7,
  isAccepted: false,
  friend: userSent,
  friendshipRequesterId: user1.id,
  friendshipRequestDate: null,
  friendshipAcceptDate: null,
};
const friendAccepted = {
  id: 8,
  isAccepted: true,
  friend: userAccepted,
  friendshipRequesterId: userAccepted.id,
  friendshipRequestDate: null,
  friendshipAcceptDate: null,
};
const friendsInitial: Friends = {
  friends: [friendReceived, friendSent, friendAccepted],
};

const userInitial: User = user1;

export const initialState: any = {
  user: userInitial,
  friends: friendsInitial,
};

const actionReceivedMock: UserCardButtonAction = {
  action: UserCardButtonActionType.ADD,
  user: randomUser,
};

const actionSentMock: UserCardButtonListAction = {
  action: UserCardButtonActionType.ADD,
  friend: randomFriend,
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

  it('should emit action on card click', () => {
    const initialStateMock: any = {
      user: userInitial,
      friends: { friends: [randomFriend] },
    };
    store.setState(initialStateMock);
    spyOn(component.action, 'emit');

    component.onAction(actionReceivedMock);

    expect(component.action.emit).toHaveBeenCalledWith(actionSentMock);
  });
});
