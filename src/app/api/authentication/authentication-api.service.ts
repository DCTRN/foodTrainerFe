import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, of, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { Tokens } from '@stores/tokens/tokens.model';
import { Environment } from '@core/environment';
import { User } from '@stores/user/user.model';
import { LoginCredentials } from './login-credentials.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationApiService {
  private readonly signature = '[AUTH.AS]';
  private readonly apiUrl = Environment.apiUrl;
  private readonly registerUrl = this.apiUrl + Environment.authUrl.REGISTER;
  private readonly loginUrl = this.apiUrl + Environment.authUrl.LOGIN;
  private readonly refreshUrl = this.apiUrl + Environment.authUrl.REFRESH;

  constructor(private http: HttpClient, private logger: NGXLogger) {}

  public refreshToken(token: string): Observable<Tokens> {
    return this.http.post(this.refreshUrl, { refresh_token: token }).pipe(
      mergeMap((t: Tokens) => of(t)),
      catchError((error) => {
        this.logger.log(`${this.signature} failed to refresh token`, error);
        return throwError(
          error?.error?.error || {
            error: 'unknown',
            errorDescription: 'Unknown error',
          }
        );
      })
    );
  }

  public login(credentials: LoginCredentials): Observable<Tokens> {
    return this.http.post(this.loginUrl, credentials).pipe(
      mergeMap((t: Tokens) => of(t)),
      catchError((error) => {
        this.logger.log(`${this.signature} failed to login`, error);
        return throwError(
          error?.error?.error || {
            error: 'unknown',
            errorDescription: 'Unknown error',
          }
        );
      })
    );
  }

  public register(user: User): Observable<User> {
    return this.http.post(this.registerUrl, user).pipe(
      mergeMap((u: User) => of(u)),
      catchError((error) => {
        this.logger.log(`${this.signature} failed to register`, error);
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
