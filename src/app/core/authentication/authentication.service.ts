import { Injectable } from '@angular/core';
import { AuthenticationApiService } from '@api/authentication/authentication-api.service';
import { LoginCredentials } from '@api/authentication/login-credentials.model';
import { ErrorFormat } from '@core/models/error-format.model';
import { Tokens } from '@stores/tokens/tokens.model';
import { User } from '@stores/user/user.model';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, tap } from 'rxjs/operators';
import { TokensStorageService } from './tokens-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly signature = '[AUTH.S]';
  private authOperation = false;
  private authState$ = new BehaviorSubject<boolean>(false);
  private registerError$ = new BehaviorSubject<ErrorFormat>(undefined);

  constructor(
    private tokensStorageService: TokensStorageService,
    private authenticationApiService: AuthenticationApiService,
    private logger: NGXLogger
  ) {
    this.logAuthStateChanges();
  }

  public refreshToken(): Observable<Tokens> {
    this.authOperation = true;
    const tokens = this.tokensStorageService.getTokens()?.refresh_token;
    return this.authenticationApiService.refreshToken(tokens).pipe(
      tap(() => (this.authOperation = false)),
      tap(() => this.authState$.next(true)),
      catchError((error) => {
        this.logger.log(`${this.signature} failed to refresh token`, error);
        this.authOperation = false;
        this.authState$.next(false);
        return throwError(error);
      })
    );
  }

  public login(credentials: LoginCredentials): Observable<Tokens> {
    this.authOperation = true;
    return this.authenticationApiService.login(credentials).pipe(
      tap(() => (this.authOperation = false)),
      tap(() => this.authState$.next(true)),
      catchError((error) => {
        this.authOperation = false;
        this.authState$.next(false);
        this.logger.log(`${this.signature} failed to login`, error);
        return throwError(error);
      })
    );
  }

  public register(user: User): Observable<User> {
    return this.authenticationApiService.register(user).pipe(
      tap(() => this.registerError$.next(null)),
      catchError((error: ErrorFormat) => {
        this.logger.log(`${this.signature} failed to register`, error);
        this.registerError$.next(error);
        return throwError(error);
      })
    );
  }

  public setAuthState(state: boolean): void {
    this.authState$.next(state);
  }

  public getAuthState$(): Observable<boolean> {
    return this.authState$.asObservable();
  }

  public getRegisterError$(): Observable<ErrorFormat> {
    return this.registerError$.asObservable();
  }

  public isAuthOperationInProgress(): boolean {
    return this.authOperation;
  }

  private logAuthStateChanges() {
    this.getAuthState$()
      .pipe(
        distinctUntilChanged(),
        tap((state) =>
          this.logger.log(`${this.signature} Auth state changed: ${state}`)
        )
      )
      .subscribe();
  }
}
