import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '@core/notifications/service/notification.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NGXLogger } from 'ngx-logger';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { AuthenticationTimerService } from '../../authentication/authentication-timer.service';
import { AuthenticationService } from '../../authentication/authentication.service';
import { TokensStorageService } from '../../authentication/tokens-storage.service';
import { TokensAction, TokensActionType } from './tokens.actions';
import { Tokens } from './tokens.model';

@Injectable()
export class TokenEffects {
  public refresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TokensAction.REFRESH_TOKENS_REQUEST),
      tap(() =>
        this.logger.log(
          `${this.signature} Handling ${TokensActionType.REFRESH_TOKENS_REQUEST}`
        )
      ),
      mergeMap(() => this.authenticationService.refreshToken()),
      // TODO fix / change behavior
      // mergeMap(() => this.authenticationService.refreshToken().pipe(retry(3))),
      tap((tokens: Tokens) => this.tokensStorageService.setTokens(tokens)),
      tap(() => this.authenticationTimerService.start()),
      map((action: Tokens) =>
        TokensAction.REFRESH_TOKENS_REQUEST_SUCCESS(action)
      ),
      catchError(() => {
        this.logger.log(`${this.signature} Failed to refresh tokens`);
        this.openSnackBar('Failed to maintain session');
        return of(TokensAction.REFRESH_TOKENS_REQUEST_FAILURE()).pipe(
          map(() => TokensAction.CLEAR_TOKENS_REQUEST())
        );
      })
    )
  );

  public clear$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TokensAction.CLEAR_TOKENS_REQUEST),
      tap(() =>
        this.logger.log(
          `${this.signature} Handling ${TokensActionType.CLEAR_TOKENS_REQUEST}`
        )
      ),
      tap(() => this.tokensStorageService.clearTokens()),
      tap(() => this.authenticationTimerService.clear()),
      tap(() => this.authenticationService.setAuthState(false)),
      tap(() => this.router.navigateByUrl('/login')),
      map(() => TokensAction.CLEAR_TOKENS_REQUEST_SUCCESS())
    )
  );

  private readonly signature = '[T.E]';

  constructor(
    private actions$: Actions,
    private authenticationTimerService: AuthenticationTimerService,
    private authenticationService: AuthenticationService,
    private tokensStorageService: TokensStorageService,
    private logger: NGXLogger,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  private openSnackBar(message: string) {
    this.notificationService.error(message);
  }
}
