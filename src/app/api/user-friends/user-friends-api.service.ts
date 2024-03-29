import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from '@core/environment';
import { propagateError } from '@core/rxjs-operators/propagate-error';
import {
  Friend,
  FriendRequest,
  UserFriend,
} from '@core/stores/friends/friends.model';
import { NGXLogger } from 'ngx-logger';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
      switchMap((u: UserFriend) => of(u)),
      propagateError()
    );
  }

  public acceptFriendRequest(userFriendId: number): Observable<UserFriend> {
    const params = new HttpParams().append(
      'userFriendId',
      String(userFriendId)
    );
    return this.http.patch(this.usersUrl, {}, { params }).pipe(
      switchMap((u: UserFriend) => of(u)),
      propagateError()
    );
  }

  public getFriendsByUserId(userId: number): Observable<Array<Friend>> {
    const params = new HttpParams().append('userId', String(userId));
    return this.http.get(this.usersUrl, { params }).pipe(
      switchMap((f: Array<Friend>) => of(f)),
      propagateError()
    );
  }

  public deleteFriendById(userFriendId: number): Observable<Object> {
    const params = new HttpParams().append(
      'userFriendId',
      String(userFriendId)
    );
    return this.http.delete(this.usersUrl, { params }).pipe(
      switchMap(() => of({})),
      propagateError()
    );
  }
}
