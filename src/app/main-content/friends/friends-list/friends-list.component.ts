import { Component, OnInit } from '@angular/core';
import { FriendsAction } from '@core/stores/friends/friends.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import {
  ListType,
  UserCardButtonListAction,
} from '../user-card-list/user-card-list.component';
import { UserCardButtonActionType } from '../user-card-list/user-card/user-card.component';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.scss'],
})
export class FriendsListComponent implements OnInit {
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

  constructor(private store: Store<AppState>) {}

  public ngOnInit(): void {}

  public onAction(action: UserCardButtonListAction): void {
    this.userCardActionHandlers[action.action](action);
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
}
