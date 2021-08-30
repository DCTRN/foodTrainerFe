import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { FriendsAction } from '@core/stores/friends/friends.actions';
import { Friend } from '@core/stores/friends/friends.model';
import { User } from '@core/stores/user/user.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { user1, user2 } from '@testsUT/user/user-mock-data.model';
import { UserCardButtonListAction } from '../user-card-list/user-card-list.component';
import { UserCardButtonActionType } from '../user-card-list/user-card/user-card.component';
import { FriendsListComponent } from './friends-list.component';

const randomUser: User = user2;

const randomFriend: Friend = {
  id: 6,
  isAccepted: false,
  friend: randomUser,
  friendshipRequesterId: 1,
  friendshipRequestDate: null,
  friendshipAcceptDate: null,
};

const friendsInitial: Friend[] = [
  {
    id: 5,
    isAccepted: true,
    friend: user1,
    friendshipRequesterId: 1,
    friendshipRequestDate: null,
    friendshipAcceptDate: null,
  },
];
const initialState = { friends: friendsInitial };

const addFriend: Friend = {
  id: null,
  isAccepted: true,
  friend: randomUser,
  friendshipRequesterId: null,
  friendshipRequestDate: null,
  friendshipAcceptDate: null,
};

const addAction: UserCardButtonListAction = {
  action: UserCardButtonActionType.ADD,
  friend: addFriend,
};

const deleteAction: UserCardButtonListAction = {
  action: UserCardButtonActionType.DELETE,
  friend: randomFriend,
};

const acceptAction: UserCardButtonListAction = {
  action: UserCardButtonActionType.ACCEPT,
  friend: randomFriend,
};

const discardAction: UserCardButtonListAction = {
  action: UserCardButtonActionType.DISCARD,
  friend: randomFriend,
};

const actions: UserCardButtonListAction[] = [
  addAction,
  deleteAction,
  acceptAction,
  discardAction,
];

describe('FriendsListComponent', () => {
  let injector: TestBed;
  let component: FriendsListComponent;
  let fixture: ComponentFixture<FriendsListComponent>;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })],
      declarations: [FriendsListComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    store = injector.inject(MockStore);
    fixture = injector.createComponent(FriendsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch appropriate event on friend action', () => {
    const expectation = [
      FriendsAction.SEND_FRIEND_REQUEST({ id: randomUser.id }),
      FriendsAction.DELETE_FRIEND_REQUEST({ id: randomFriend.id }),
      FriendsAction.ACCEPT_FRIEND_REQUEST({ id: randomFriend.id }),
      FriendsAction.DELETE_FRIEND_REQUEST({ id: randomFriend.id }),
    ];
    spyOn(store, 'dispatch');

    actions.forEach((action, i) => {
      component.onAction(action);
      expect(store.dispatch).toHaveBeenCalledWith(expectation[i]);
    });
  });
});
