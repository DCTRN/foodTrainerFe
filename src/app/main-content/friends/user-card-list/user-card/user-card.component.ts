import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Friend } from '@core/stores/friends/friends.model';

export enum UserCardButtonActionType {
  ADD,
  DELETE,
  ACCEPT,
  DISCARD,
}

export interface UserCardButtonAction {
  action: UserCardButtonActionType;
  friend: Friend;
}

export interface UserCardButton {
  isDisabled: boolean;
  isDisplayed: boolean;
}

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent implements OnInit {
  @Input() friend: Friend;
  @Input() add: Partial<UserCardButton> = {
    isDisabled: false,
    isDisplayed: false,
  };
  @Input() delete: Partial<UserCardButton> = {
    isDisabled: false,
    isDisplayed: false,
  };
  @Input() accept: Partial<UserCardButton> = {
    isDisabled: false,
    isDisplayed: false,
  };
  @Input() discard: Partial<UserCardButton> = {
    isDisabled: false,
    isDisplayed: false,
  };
  @Output()
  actions: EventEmitter<UserCardButtonAction> = new EventEmitter<UserCardButtonAction>();
  public action = UserCardButtonActionType;
  constructor() {}

  public ngOnInit(): void {}

  public onButtonClick(action: UserCardButtonActionType): void {
    this.actions.emit({ action, friend: this.friend });
  }
}
