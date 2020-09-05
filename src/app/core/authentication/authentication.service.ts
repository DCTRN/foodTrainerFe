import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationApiService } from '@api/authentication/authentication-api.service';
import { LoginCredentials } from '@api/authentication/login-credentials.model';
import { Tokens } from '@stores/tokens/tokens.model';
import { User } from '@stores/user/user.model';
import { TokensStorageService } from './tokens-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly signature = '[AUTH.S]';
  constructor(
    private tokensStorageService: TokensStorageService,
    private authenticationApiService: AuthenticationApiService,
    private logger: NGXLogger
  ) {}

  public refreshToken(): Observable<Tokens> {
    const tokens = this.tokensStorageService.getTokens()?.refresh_token;
    return this.authenticationApiService.refreshToken(tokens).pipe(
      catchError((error) => {
        this.logger.log(`${this.signature} failed to refresh token`, error);
        return throwError(error);
      })
    );
  }

  public login(credentials: LoginCredentials): Observable<Tokens> {
    return this.authenticationApiService.login(credentials).pipe(
      catchError((error) => {
        this.logger.log(`${this.signature} failed to login`, error);
        return throwError(error);
      })
    );
  }

  public register(user: User): Observable<User> {
    return this.authenticationApiService.register(user).pipe(
      catchError((error) => {
        this.logger.log(`${this.signature} failed to register`, error);
        return throwError(error);
      })
    );
  }
}
