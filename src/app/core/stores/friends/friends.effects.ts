import { Injectable } from '@angular/core';
import { UserFriendsApiService } from '@api/user-friends/user-friends-api.service';
import { ErrorFormat } from '@core/models/error-format.model';
import { NotificationType } from '@core/notifications/models/notification-type';
import { NotificationService } from '@core/notifications/service/notification.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { NGXLogger } from 'ngx-logger';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { User } from '../user/user.model';
import { FriendsAction, FriendsActionType } from './friends.actions';
import { Friend, FriendRequest, UserFriend } from './friends.model';

@Injectable()
export class FriendsEffects {
  public getAllFriends$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FriendsAction.GET_ALL_FRIENDS_REQUEST),
      tap(() =>
        this.logger.log(
          `${this.signature} Handling ${FriendsActionType.GET_ALL_FRIENDS_REQUEST}`
        )
      ),
      switchMap(() => this.store.pipe(select('user'))),
      switchMap((u) => this.userFriendsApiService.getFriendsByUserId(u?.id)),
      map((friends) =>
        FriendsAction.GET_ALL_FRIENDS_REQUEST_SUCCESS({ friends })
      ),
      catchError((error: ErrorFormat) => {
        this.logger.log(`${this.signature} Failed to get friends`, error);
        this.openSnackBar('Failed to get friends');
        return of(FriendsAction.GET_ALL_FRIENDS_REQUEST_ERROR());
      })
    )
  );

  public sendFriendRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FriendsAction.SEND_FRIEND_REQUEST),
      tap(() =>
        this.logger.log(
          `${this.signature} Handling ${FriendsActionType.SEND_FRIEND_REQUEST}`
        )
      ),
      switchMap((action) =>
        this.store.pipe(
          select('user'),
          map((user: User) => this.createFriendRequest(user, action.id))
        )
      ),
      switchMap((friendRequest) =>
        this.userFriendsApiService.sendFriendRequest(friendRequest)
      ),
      map((userFriend: UserFriend) => {
        const friend: Friend = this.createFriend(userFriend);
        return FriendsAction.SEND_FRIEND_REQUEST_SUCCESS({ friend });
      }),
      catchError((error: ErrorFormat) => {
        this.logger.log(
          `${this.signature} Failed to send friend request`,
          error
        );
        this.openSnackBar('Failed to send friend request');
        return of(FriendsAction.SEND_FRIEND_REQUEST_ERROR());
      })
    )
  );

  public acceptFriendRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FriendsAction.ACCEPT_FRIEND_REQUEST),
      tap(() =>
        this.logger.log(
          `${this.signature} Handling ${FriendsActionType.ACCEPT_FRIEND_REQUEST}`
        )
      ),
      switchMap((action) =>
        this.userFriendsApiService.acceptFriendRequest(action.id)
      ),
      map((userFriend: UserFriend) => {
        const friend: Friend = this.createFriend(userFriend);
        return FriendsAction.ACCEPT_FRIEND_REQUEST_SUCCESS({ friend });
      }),
      catchError((error: ErrorFormat) => {
        this.logger.log(
          `${this.signature} Failed to accept friend request`,
          error
        );
        this.openSnackBar('Failed to accept friend request');
        return of(FriendsAction.ACCEPT_FRIEND_REQUEST_ERROR());
      })
    )
  );

  public deleteFriendRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FriendsAction.DELETE_FRIEND_REQUEST),
      tap(() =>
        this.logger.log(
          `${this.signature} Handling ${FriendsActionType.ACCEPT_FRIEND_REQUEST}`
        )
      ),
      switchMap((action) =>
        this.userFriendsApiService
          .deleteFriendById(action.id)
          .pipe(
            map((userFriend: UserFriend) =>
              FriendsAction.DELETE_FRIEND_REQUEST_SUCCESS({ id: action.id })
            )
          )
      ),
      catchError((error: ErrorFormat) => {
        this.logger.log(
          `${this.signature} Failed to delete friend request`,
          error
        );
        this.openSnackBar('Failed to delete friend request');
        return of(FriendsAction.DELETE_FRIEND_REQUEST_ERROR());
      })
    )
  );

  private readonly signature = '[F.E]';

  constructor(
    private actions$: Actions,
    private logger: NGXLogger,
    private notificationService: NotificationService,
    private userFriendsApiService: UserFriendsApiService,
    private store: Store<AppState>
  ) {}

  private createFriend(userFriend: UserFriend): Friend {
    return {
      id: userFriend.id,
      isAccepted: userFriend.isAccepted,
      friend: userFriend.friend,
      friendshipRequesterId: userFriend.friendshipRequesterId,
      friendshipRequestDate: userFriend.friendshipRequestDate,
      friendshipAcceptDate: userFriend.friendshipAcceptDate,
    };
  }

  private createFriendRequest(user: User, id: number): FriendRequest {
    return { userId: user?.id, friendId: id };
  }

  private openSnackBar(
    message: string,
    type: NotificationType = NotificationType.ERROR
  ) {
    if (type === NotificationType.ERROR) {
      this.notificationService.error(message);
    } else {
      this.notificationService.success(message);
    }
  }
}
