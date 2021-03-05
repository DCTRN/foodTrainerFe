import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from '@core/environment';
import { propagateError } from '@core/rxjs-operators/propagate-error';
import { User } from '@core/stores/user/user.model';
import { NGXLogger } from 'ngx-logger';
import { Observable, of, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private readonly signature = '[USR.AS]';
  private readonly apiUrl = Environment.apiUrl;
  private readonly usersUrl = this.apiUrl + Environment.userUrl.USERS;
  private readonly nullUser: User = {
    id: null,
    username: null,
    email: null,
    birthDate: null,
    phoneNumber: null,
    firstName: null,
    lastName: null,
    authenticationLevel: null,
  };
  constructor(private http: HttpClient, private logger: NGXLogger) {}

  public getUserCredentialsByUsername(username: string): Observable<User> {
    const params = new HttpParams().append('username', username);
    return this.http.get(this.usersUrl, { params }).pipe(
      mergeMap((u: User[]) => (u?.length ? of(u[0]) : of(this.nullUser))),
      propagateError()
    );
  }

  public findUsersBy(searchText: string): Observable<Array<User>> {
    const params = new HttpParams().append('findBy', searchText);
    return this.http.get(this.usersUrl, { params }).pipe(
      mergeMap((u: User[]) => (u?.length ? of(u) : of([]))),
      propagateError()
    );
  }

  public updateUserCredentials(user: User): Observable<User> {
    return this.http.patch(`${this.usersUrl}/${user?.id}`, user).pipe(
      mergeMap((u: User) => of(u)),
      propagateError()
    );
  }
}
