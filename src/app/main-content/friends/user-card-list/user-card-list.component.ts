import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FriendsAction } from '@core/stores/friends/friends.actions';
import { Friend } from '@core/stores/friends/friends.model';
import { UserAction } from '@core/stores/user/user.actions';
import { User } from '@core/stores/user/user.model';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { UserCardButton } from './user-card/user-card.component';

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
  public type = ListType;
  public currentUser: User;
  public friends: Array<Friend> = [];
  public enable: Partial<UserCardButton> = {
    isDisabled: false,
    isDisplayed: true,
  };

  private subscriptions = new Subscription();

  constructor(private store: Store<AppState>) {}

  public ngOnInit(): void {
    this.dispatchInitialActions();
    this.subscribeToUser();
    this.subscribeToFriends();
  }

  public ngOnDestroy(): void {}

  public getFriends(): Array<Friend> {
    return this.friends.filter((f) => f.isAccepted);
  }

  public getSentFriendRequest(): Array<Friend> {
    return this.friends
      .filter((f) => !f.isAccepted)
      .filter((f) => f.friendshipRequesterId === this.currentUser.id);
  }

  public getReceivedFriendRequest(): Array<Friend> {
    return this.friends
      .filter((f) => !f.isAccepted)
      .filter((f) => f.friendshipRequesterId !== this.currentUser.id);
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
      this.store
        .pipe(
          select('friends'),
          filter((f) => !!f.friends.length)
        )
        .subscribe((f) => (this.friends = f.friends))
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
}
