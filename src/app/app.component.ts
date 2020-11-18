import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { AuthenticationService } from '@core/authentication/authentication.service';
import { TokensStorageService } from '@core/authentication/tokens-storage.service';
import { TokensAction } from '@core/stores/tokens/tokens.actions';
import { Tokens } from '@core/stores/tokens/tokens.model';
import { Store } from '@ngrx/store';
import { NGXLogger } from 'ngx-logger';
import { LocalStorageService } from 'ngx-webstorage';
import { interval, Observable, of } from 'rxjs';
import { delay, filter, mergeMap, skipWhile, take, tap } from 'rxjs/operators';
import { AppState } from './reducers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public title = 'food-trainer';
  public showSpinner = true;
  private readonly signature = '[APP.C]';

  constructor(
    private logger: NGXLogger,
    private router: Router,
    private tokensStore: Store<AppState>,
    private localStorageService: LocalStorageService,
    private tokensStorageService: TokensStorageService,
    private authenticationService: AuthenticationService
  ) {
    this.logEvents();
  }

  public ngOnInit(): void {
    this.tokensHandler();
  }

  private tokensHandler(): void {
    const tokens = this.localStorageService.retrieve('tokens') as Tokens;
    if (!tokens) {
      this.missingTokensHandler();
    } else {
      this.tokensPresenseHandler(tokens);
    }
  }

  private tokensPresenseHandler(tokens: Tokens): void {
    this.tokensStorageService.setTokens(tokens);
    this.tokensStore.dispatch(TokensAction.REFRESH_TOKENS_REQUEST());
    this.refreshTokenHander();
  }

  private refreshTokenHander(): void {
    of(null)
      .pipe(
        delay(200),
        mergeMap(() => this.waitForAuthOperationToFinish()),
        mergeMap(() => this.authenticationService.getAuthState$()),
        take(1),
        tap(() => setTimeout(() => (this.showSpinner = false), 1000)),
        filter((state: boolean) => state),
        tap(() => this.router.navigateByUrl('/main'))
      )
      .subscribe();
  }

  private missingTokensHandler(): void {
    this.showSpinner = false;
    this.router.navigateByUrl('/');
  }

  private waitForAuthOperationToFinish(): Observable<number> {
    return interval(33).pipe(
      skipWhile(() => this.authenticationService.isAuthOperationInProgress()),
      take(1)
    );
  }

  private logEvents(): void {
    this.logger.log(`${this.signature} ${this.title} started!`);
    this.subscribeToRouterEvents();
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
}
