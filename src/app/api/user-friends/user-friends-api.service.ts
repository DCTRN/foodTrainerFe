import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from '@core/environment';
import { User } from '@core/stores/user/user.model';
import { NGXLogger } from 'ngx-logger';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { propagateError } from '../../core/rxjs-operators/propagate-error';

export interface FriendRequest {
  userId: number;
  friendId: number;
}

export interface Friend {
  id: number;
  isAccepted: boolean;
  friend: User;
  friendshipRequesterId: number;
  friendshipRequestDate: Date;
  friendshipAcceptDate: Date;
}

export interface UserFriend extends Friend {
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class UserFriendsApiService {
  private readonly signature = '[USRFR.AS]';
  private readonly apiUrl = Environment.apiUrl;
  private readonly usersUrl = this.apiUrl + Environment.userUrl.USER_FRIENDS;

  constructor(private http: HttpClient, private logger: NGXLogger) {}

  public sendFriendRequest(
    friendRequest: FriendRequest
  ): Observable<UserFriend> {
    return this.http.post(this.usersUrl, friendRequest).pipe(
      mergeMap((u: UserFriend) => of(u)),
      propagateError()
    );
  }

  public acceptFriendRequest(userFriendId: number): Observable<UserFriend> {
    const params = new HttpParams().append(
      'userFriendId',
      String(userFriendId)
    );
    return this.http.patch(this.usersUrl, {}, { params }).pipe(
      mergeMap((u: UserFriend) => of(u)),
      propagateError()
    );
  }

  public getFriendsByUserId(userId: number): Observable<Array<Friend>> {
    const params = new HttpParams().append('userId', String(userId));
    return this.http.get(this.usersUrl, { params }).pipe(
      mergeMap((f: Array<Friend>) => of(f)),
      propagateError()
    );
  }

  public deleteFriendById(userFriendId: number): Observable<Object> {
    const params = new HttpParams().append(
      'userFriendId',
      String(userFriendId)
    );
    return this.http.delete(this.usersUrl, { params }).pipe(
      mergeMap(() => of({})),
      propagateError()
    );
  }
}
