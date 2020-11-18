import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginCredentials } from '@api/authentication/login-credentials.model';
import { Environment } from '@core/environment';
import { Tokens } from '@core/stores/tokens/tokens.model';
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
  private readonly usersUrl = this.apiUrl + Environment.userUrl;
  private readonly nullUser: User = {
    id: null,
    username: null,
    email: null,
    birthDate: null,
    phoneNumber: null,
    firstName: null,
    lastName: null,
    authenticationLevel: null
  };
  constructor(private http: HttpClient, private logger: NGXLogger) {}

  public getUserCredentialsByUsername(username: string): Observable<User> {
    const params = new HttpParams().append('username', username);
    return this.http.get(this.usersUrl, { params }).pipe(
      mergeMap((u: User[]) => u?.length ? of(u[0]) : of(this.nullUser)),
      catchError((error) => {
        this.logger.log(`${this.signature} failed to fetch user credentials`, error);
        return throwError(
          error?.error?.error || {
            error: 'unknown',
            errorDescription: 'Unknown error',
          }
        );
      })
    );
  }

  public findUsersBy(searchText: string): Observable<Array<User>> {
    const params = new HttpParams().append('findBy', searchText);
    return this.http.get(this.usersUrl, { params }).pipe(
      mergeMap((u: User[]) => u?.length ? of(u) : of([this.nullUser])),
      catchError((error) => {
        this.logger.log(`${this.signature} failed to find users`, error);
        return throwError(
          error?.error?.error || {
            error: 'unknown',
            errorDescription: 'Unknown error',
          }
        );
      })
    );
  }

  public updateUserCredentials(user: User): Observable<User> {
    return this.http.post(`${this.usersUrl}/${user?.id}`, user).pipe(
      mergeMap((u: User) => of(u)),
      catchError((error) => {
        this.logger.log(`${this.signature} failed update user credentials`, error);
        return throwError(
          error?.error?.error || {
            error: 'unknown',
            errorDescription: 'Unknown error',
          }
        );
      })
    );
  }
}
