import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { AuthenticationService } from '@core/authentication/authentication.service';
import { TokensStorageService } from '@core/authentication/tokens-storage.service';
import { waitWhile } from '@core/rxjs-operators/wait-while';
import { TokensAction } from '@core/stores/tokens/tokens.actions';
import { Tokens } from '@core/stores/tokens/tokens.model';
import { UserAction } from '@core/stores/user/user.actions';
import { User } from '@core/stores/user/user.model';
import { select, Store } from '@ngrx/store';
import { NGXLogger } from 'ngx-logger';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, of, Subscription } from 'rxjs';
import {
  catchError,
  delay,
  filter,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { AppState } from './reducers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public title = 'food-trainer';
  public showSpinner = true;

  private readonly signature = '[APP.C]';
  private user: User;
  private authStatePredicate = () =>
    this.authenticationService.isAuthOperationInProgress();
  private subscriptions = new Subscription();

  constructor(
    private logger: NGXLogger,
    private router: Router,
    private store: Store<AppState>,
    private localStorageService: LocalStorageService,
    private tokensStorageService: TokensStorageService,
    private authenticationService: AuthenticationService
  ) {
    this.logEvents();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public ngOnInit(): void {
    this.subscribeToUserCredentials();
    this.bootstrapHandler();
  }

  private subscribeToUserCredentials(): void {
    this.subscriptions.add(
      this.store
        .pipe(
          select('user'),
          filter((user: User) => !!user.id)
        )
        .subscribe((user: User) => (this.user = user))
    );
  }

  private bootstrapHandler(): void {
    const tokens = this.localStorageService.retrieve('tokens') as Tokens;
    const username = this.localStorageService.retrieve('username') as string;
    if (!tokens || !username) {
      this.missingInformationHandler();
    } else {
      this.tokensPresenseHandler(tokens);
    }
  }

  private tokensPresenseHandler(tokens: Tokens): void {
    this.tokensStorageService.setTokens(tokens);
    this.store.dispatch(TokensAction.REFRESH_TOKENS_REQUEST());
    this.refreshTokenHander();
  }

  private refreshTokenHander(): void {
    of(null)
      .pipe(
        delay(200),
        switchMap(() => waitWhile(this.authStatePredicate)),
        switchMap(() => this.authenticationService.getAuthState$()),
        take(1),
        switchMap((state: boolean) => this.statehandler(state))
      )
      .subscribe();
  }

  private statehandler(state: boolean): Observable<boolean> {
    return !state
      ? this.unauthorizedHandler(state)
      : this.authorizedHandler(state);
  }

  private authorizedHandler(state: boolean): Observable<boolean> {
    return of(state).pipe(
      tap(() => this.store.dispatch(UserAction.GET_CREDENTIALS_REQUEST())),
      switchMap(() => waitWhile(() => !this.user?.id)),
      map((v) => !!v),
      tap(() => this.authorizedNavigationHandler()),
      tap(() => this.hideSpinnerWithDelay()),
      catchError(() => this.missingUserCredentialsHandler(state))
    );
  }

  private authorizedNavigationHandler(): void {
    if (this.isOnMainPage()) {
      return;
    }
    this.navigateToMainPage();
  }

  private missingUserCredentialsHandler(state: boolean): Observable<boolean> {
    return this.unauthorizedHandler(state).pipe(
      tap(() => this.store.dispatch(TokensAction.CLEAR_TOKENS_REQUEST()))
    );
  }

  private unauthorizedHandler(state: boolean): Observable<boolean> {
    return of(state).pipe(
      tap(() => this.navigateToLandingPage()),
      tap(() => this.hideSpinnerWithDelay())
    );
  }

  private missingInformationHandler(): void {
    this.hideSpinnerWithDelay();
    if (!this.isOnMainPage()) {
      return;
    }
    this.navigateToLandingPage();
  }

  private subscribeToRouterEvents(): void {
    this.router.events
      .pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd),
        tap((event: NavigationEnd) =>
          this.logger.log(`${this.signature} navigated to: ${event.url}`)
        )
      )
      .subscribe();
  }

  private logEvents(): void {
    this.logger.log(`${this.signature} ${this.title} started!`);
    this.subscribeToRouterEvents();
  }

  private isOnMainPage(): boolean {
    return this.router.url.includes('main');
  }

  private navigateToLandingPage(): void {
    this.router.navigateByUrl('/');
  }

  private navigateToMainPage(): void {
    this.router.navigateByUrl('/main');
  }

  private hideSpinnerWithDelay(): void {
    setTimeout(() => (this.showSpinner = false), 1000);
  }
}
