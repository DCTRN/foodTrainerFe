import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ErrorFormat } from '@core/models/error-format.model';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NGXLogger } from 'ngx-logger';
import { of } from 'rxjs';
import { catchError, map, mergeMap, retry, tap } from 'rxjs/operators';
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
      mergeMap(() => this.authenticationService.refreshToken().pipe(retry(3))),
      tap((tokens: Tokens) => this.tokensStorageService.setTokens(tokens)),
      tap(() => this.authenticationTimerService.start()),
      map((action: Tokens) =>
        TokensAction.REFRESH_TOKENS_REQUEST_SUCCESS(action)
      ),
      catchError((error: ErrorFormat) => {
        this.logger.log(`${this.signature} Failed to refresh tokens`);
        this.openSnackBar('Failed to maintain session');
        return of(TokensAction.REFRESH_TOKENS_REQUEST_FAILURE()).pipe(
          map(() => TokensAction.CLEAR_TOKENS_REQUEST)
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
    private snackBar: MatSnackBar
  ) {}

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
    });
  }
}
