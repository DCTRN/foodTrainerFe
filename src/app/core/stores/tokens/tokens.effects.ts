import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, tap } from 'rxjs/operators';
import { AuthenticationTimerService } from '../../authentication/authentication-timer.service';
import { AuthenticationService } from '../../authentication/authentication.service';
import { TokensStorageService } from '../../authentication/tokens-storage.service';
import { TokensAction, TokensActionType } from './tokens.actions';
import { Tokens } from './tokens.model';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class TokenEffects {
  public login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TokensAction.LOGIN),
      tap(() =>
        this.logger.log(`${this.signature} Handling ${TokensActionType.LOGIN}`)
      ),
      tap((tokens: Tokens) => this.tokensStorageService.setTokens(tokens)),
      tap(() => this.authenticationTimerService.start()),
      map((action: Tokens) => TokensAction.UPDATE(action))
    )
  );

  public refresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TokensAction.REFRESH),
      tap(() =>
        this.logger.log(
          `${this.signature} Handling ${TokensActionType.REFRESH}`
        )
      ),
      // TODO add error handling
      mergeMap(() => this.authenticationService.refreshToken()),
      tap((tokens: Tokens) => this.tokensStorageService.setTokens(tokens)),
      tap(() => this.authenticationTimerService.start()),
      map((action: Tokens) => TokensAction.UPDATE(action))
    )
  );

  private readonly signature = '[T.E]';

  constructor(
    private actions$: Actions,
    private authenticationTimerService: AuthenticationTimerService,
    private authenticationService: AuthenticationService,
    private tokensStorageService: TokensStorageService,
    private logger: NGXLogger
  ) {}
}
