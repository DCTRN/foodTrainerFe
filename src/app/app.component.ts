import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { AuthenticationService } from '@core/authentication/authentication.service';
import { TokensStorageService } from '@core/authentication/tokens-storage.service';
import { ModalService } from '@core/modal-service/modal.service';
import { ModalConfiguration } from '@core/modal-service/models/modal-configuration';
import { NotificationComponent } from '@core/notifications/component/notification.component';
import { NotificationService } from '@core/notifications/service/notification.service';
import { TokensAction } from '@core/stores/tokens/tokens.actions';
import { Tokens } from '@core/stores/tokens/tokens.model';
import { Store } from '@ngrx/store';
import { NGXLogger } from 'ngx-logger';
import { LocalStorageService } from 'ngx-webstorage';
import { from, interval, of, Subject } from 'rxjs';
import {
  concatMap,
  delay,
  filter,
  mergeMap,
  skipWhile,
  switchMap,
  take,
  tap,
  toArray,
} from 'rxjs/operators';
import { AppState } from './reducers';

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
    private modalService: ModalService,
    private notificationService: NotificationService
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
    this.notificationService.success('test1', 3000);
    // this.notificationService.success('test2');
    // this.modalService.openDialog(new ModalConfiguration());
  }

  private waitForAuthOperationToFinish() {
    return interval(33).pipe(
      skipWhile(() => this.authenticationService.isAuthOperationInProgress()),
      take(1)
    );
  }
}
