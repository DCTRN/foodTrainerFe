import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Router, NavigationEnd, RouterEvent } from '@angular/router';
import {
  filter,
  tap,
  map,
  mergeMap,
  skipWhile,
  take,
  delay,
} from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Tokens } from '@core/stores/tokens/tokens.model';
import { LocalStorageService } from 'ngx-webstorage';
import { TokensAction } from '@core/stores/tokens/tokens.actions';
import { TokensStorageService } from '@core/authentication/tokens-storage.service';
import { Token } from '@angular/compiler/src/ml_parser/lexer';
import { of, interval } from 'rxjs';
import { AuthenticationService } from '@core/authentication/authentication.service';
import { AppState } from './reducers';
import { ModalService } from '@core/modal-service/modal.service';
import { ModalConfiguration } from '@core/modal-service/models/modal-configuration';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
    private authenticationService: AuthenticationService,
    private modalService: ModalService
  ) {
    this.logger.log(`${this.signature} ${this.title} started!`);
    this.router.events
      .pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd),
        tap((event: NavigationEnd) =>
          this.logger.log(`${this.signature} navigated to: ${event.url}`)
        )
      )
      .subscribe();
  }

  public ngOnInit(): void {
    const tokens = this.localStorageService.retrieve('tokens') as Tokens;
    if (!tokens) {
      this.showSpinner = false;
    } else {
      this.tokensStorageService.setTokens(tokens);
      this.tokensStore.dispatch(TokensAction.REFRESH_TOKENS_REQUEST());
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
  }

  public openModale(): void {
    this.modalService.openDialog(new ModalConfiguration());
  }

  private waitForAuthOperationToFinish() {
    return interval(33).pipe(
      skipWhile(() => this.authenticationService.isAuthOperationInProgress()),
      take(1)
    );
  }
}
