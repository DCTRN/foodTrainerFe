import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FriendsAction } from '@core/stores/friends/friends.actions';
import { Friend } from '@core/stores/friends/friends.model';
import { UserAction } from '@core/stores/user/user.actions';
import { User } from '@core/stores/user/user.model';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import {
  UserCardButton,
  UserCardButtonAction,
  UserCardButtonActionType,
} from './user-card/user-card.component';

import { cloneDeep } from 'lodash';

export interface UserCardButtonListAction {
  action: UserCardButtonActionType;
  friend: Partial<Friend>;
}

export enum ListType {
  ALL_USERS,
  FRIENDS,
  FRIEND_REQUEST_RECEIVED,
  FRIEND_REQUEST_SENT,
}

@Component({
  selector: 'app-user-card-list',
  templateUrl: './user-card-list.component.html',
  styleUrls: ['./user-card-list.component.scss'],
})
export class UserCardListComponent implements OnInit, OnDestroy {
  @Input() public listType: ListType;
  @Input() public users: Array<User>;
  @Output()
  action: EventEmitter<UserCardButtonListAction> = new EventEmitter<UserCardButtonListAction>();
  public type = ListType;
  public currentUser: User;
  public readonly userAddFriendText = 'You can invite this user to you friends';
  public readonly userFriendText = 'You are friends already';
  public readonly userFriendSentText =
    'You have already sent friend request to this user';
  public readonly userFriendReceivedText =
    'This user has sent you friend request';
  public friends: Array<Friend> = [];
  public enable: Partial<UserCardButton> = {
    isDisabled: false,
    isDisplayed: true,
  };
  public sentFriends: Array<Friend> = [];
  public receivedFriends: Array<Friend> = [];
  public acceptedFriends: Array<Friend> = [];

  private subscriptions = new Subscription();

  constructor(
    private store: Store<AppState>,
    private changeDectorRef: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.dispatchInitialActions();
    this.subscribeToUser();
    this.subscribeToFriends();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onAction(action: UserCardButtonAction): void {
    const friend =
      this.friends.find((friend) => friend.friend.id === action.user.id) ||
      this.generatePartialFriend(action);
    this.action.emit({ action: action.action, friend });
  }

  public getFriends(): Array<Friend> {
    return this.friends.filter((f) => f.isAccepted);
  }

  public getSentFriendRequest(): Array<Friend> {
    return this.friends
      .filter((f) => !f.isAccepted)
      .filter((f) => f.friendshipRequesterId === this.currentUser.id);
  }

  public getReceivedFriendRequest(): Array<Friend> {
    const notAccepted = this.friends.filter((f) => !f.isAccepted);
    const received = this.friends.filter(
      (f) => f.friendshipRequesterId !== this.currentUser.id
    );
    const result = this.friends
      .filter((f) => !f.isAccepted)
      .filter((f) => f.friendshipRequesterId !== this.currentUser.id);
    return result;
  }

  public generateListType(user: User): ListType {
    const f = this.friends.find((f: Friend) => f.friend.id === user.id);
    if (!f) {
      return ListType.ALL_USERS;
    }
    if (f.isAccepted) {
      return ListType.FRIENDS;
    }
    if (f.friendshipRequesterId === this.currentUser.id) {
      return ListType.FRIEND_REQUEST_SENT;
    }
    if (f.friendshipRequesterId !== this.currentUser.id) {
      return ListType.FRIEND_REQUEST_RECEIVED;
    }
    return ListType.ALL_USERS;
  }

  private subscribeToFriends(): void {
    this.subscriptions.add(
      this.store.pipe(select('friends')).subscribe((f) => {
        this.friends = cloneDeep(f.friends);
        this.acceptedFriends = this.getFriends();
        this.sentFriends = this.getSentFriendRequest();
        this.receivedFriends = this.getReceivedFriendRequest();
        this.changeDectorRef.detectChanges();
      })
    );
  }

  private subscribeToUser(): void {
    this.subscriptions.add(
      this.store.pipe(select('user')).subscribe((u) => (this.currentUser = u))
    );
  }

  private dispatchInitialActions(): void {
    this.store.dispatch(UserAction.GET_CREDENTIALS_REQUEST());
    this.store.dispatch(FriendsAction.GET_ALL_FRIENDS_REQUEST());
  }

  private generatePartialFriend(action: UserCardButtonAction): Friend {
    return {
      id: null,
      isAccepted: null,
      friendshipRequesterId: null,
      friendshipRequestDate: null,
      friendshipAcceptDate: null,
      friend: action.user,
    };
  }
}
