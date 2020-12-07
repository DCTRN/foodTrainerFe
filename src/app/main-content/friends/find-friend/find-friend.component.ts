import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
import { FriendsAction } from '@core/stores/friends/friends.actions';
import { User } from '@core/stores/user/user.model';
import { Store } from '@ngrx/store';
import { SimpleErrorStateMatcher } from '@utils/simple-error-state-matcher.class';
import { Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import {
  ListType,
  UserCardButtonListAction,
} from '../user-card-list/user-card-list.component';
import { UserCardButtonActionType } from '../user-card-list/user-card/user-card.component';
import { FindFriendService } from './find-friend.service';

@Component({
  selector: 'app-find-friend',
  templateUrl: './find-friend.component.html',
  styleUrls: ['./find-friend.component.scss'],
})
export class FindFriendComponent implements OnInit, OnDestroy {
  public simpleErrorStateMatcher = new SimpleErrorStateMatcher();
  public searchTextFormControl = new FormControl();
  public searchText: string;
  public disabled = true;
  public toolTipContent = 'Please, type username of user you want to find.';
  public toolTipPosition: TooltipPosition = 'above';
  public toolTipDelay = 200;
  public users: User[] = [];
  public type = ListType;

  private userCardActionHandlers = {
    [UserCardButtonActionType.ADD]: (action: UserCardButtonListAction) =>
      this.addHandler(action),
    [UserCardButtonActionType.DELETE]: (action: UserCardButtonListAction) =>
      this.deleteHandler(action),
    [UserCardButtonActionType.ACCEPT]: (action: UserCardButtonListAction) =>
      this.acceptHandler(action),
    [UserCardButtonActionType.DISCARD]: (action: UserCardButtonListAction) =>
      this.discardHandler(action),
  };
  private subscriptions = new Subscription();

  constructor(
    private findFriendService: FindFriendService,
    private store: Store<AppState>
  ) {}

  public ngOnInit(): void {
    this.subscribeToSearchInputChanges();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onFindClick(): void {
    if (!this.searchText) {
      return;
    }
    this.fetchUsers();
  }

  public onAction(action: UserCardButtonListAction): void {
    this.userCardActionHandlers[action.action](action);
  }

  public clear(): void {
    this.users = [];
    this.searchText = null;
    this.disabled = true;
  }

  private addHandler(action: UserCardButtonListAction): void {
    this.store.dispatch(
      FriendsAction.SEND_FRIEND_REQUEST({ id: action.friend.friend.id })
    );
  }
  private deleteHandler(action: UserCardButtonListAction): void {
    this.store.dispatch(
      FriendsAction.DELETE_FRIEND_REQUEST({ id: action.friend.id })
    );
  }
  private acceptHandler(action: UserCardButtonListAction): void {
    this.store.dispatch(
      FriendsAction.ACCEPT_FRIEND_REQUEST({ id: action.friend.id })
    );
  }
  private discardHandler(action: UserCardButtonListAction): void {
    this.store.dispatch(
      FriendsAction.DELETE_FRIEND_REQUEST({ id: action.friend.id })
    );
  }

  private subscribeToSearchInputChanges(): void {
    this.subscriptions.add(
      this.searchTextFormControl.valueChanges.pipe().subscribe((c: string) => {
        this.buttonDisableHandler(c);
      })
    );
  }

  private buttonDisableHandler(c: string): void {
    if (c) {
      this.disabled = false;
    } else {
      this.disabled = true;
    }
  }

  private fetchUsers(): void {
    this.findFriendService
      .findUsersBy(this.searchText)
      .pipe(take(1))
      .subscribe((users) => (this.users = users));
  }
}
