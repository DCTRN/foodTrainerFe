import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, mergeMap, tap, map } from 'rxjs/operators';
import { AuthenticationService } from '../../authentication/authentication.service';
import { UserAction, userUpdate, UserActionType } from './user.actions';
import { User } from './user.model';
import { Tokens } from '../tokens/tokens.model';
import { TokensAction } from '../tokens/tokens.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { LoginCredentials } from '@api/authentication/login-credentials.model';
import { ErrorFormat } from '@core/models/error-format.model';
import { AuthenticationTimerService } from '@core/authentication/authentication-timer.service';
import { TokensStorageService } from '@core/authentication/tokens-storage.service';
import { NotificationService } from '@core/notifications/service/notification.service';

@Injectable()
export class UserEffects {
  public register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAction.REGISTER_REQUEST),
      tap(() =>
        this.logger.log(
          `${this.signature} Handling ${UserActionType.REGISTER_REQUEST}`
        )
      ),
      mergeMap((action: User) => {
        return this.authenticationService.register(action).pipe(
          map((user: User) => userUpdate(user)),
          tap(() =>
            this.notificationService.success('Registered successfully! Now you can log in^^')
          ),
          tap(() => this.router.navigateByUrl('/login')),
          catchError((err: ErrorFormat) =>
            this.handleError(
              err,
              `${err.errorDescription || this.failedRegisterMessage}.`
            )
          )
        );
      })
    )
  );

  public login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAction.LOGIN_REQUEST),
      tap(() =>
        this.logger.log(
          `${this.signature} Handling ${UserActionType.LOGIN_REQUEST}`
        )
      ),
      mergeMap((action: LoginCredentials) => {
        return this.authenticationService
          .login(this.createLoginCredentials(action))
          .pipe(
            tap((tokens: Tokens) =>
              this.tokensStorageService.setTokens(tokens)
            ),
            tap(() => this.authenticationTimerService.start()),
            map((tokens: Tokens) => TokensAction.LOGIN_REQUEST_SUCCESS(tokens)),
            tap(() => this.router.navigateByUrl('/main')),
            catchError((err) => this.handleError(err, this.failedLoginMessage))
          );
      })
    )
  );

  private readonly signature = '[U.E]';
  private readonly failedLoginMessage = 'Failed to login. Please try again.';
  private readonly failedRegisterMessage =
    '. Failed to register. Please try again.';

  constructor(
    private actions$: Actions,
    private authenticationService: AuthenticationService,
    private authenticationTimerService: AuthenticationTimerService,
    private tokensStorageService: TokensStorageService,
    private notificationService: NotificationService,
    private router: Router,
    private logger: NGXLogger
  ) {}

  private createLoginCredentials(action: LoginCredentials): LoginCredentials {
    return { username: action.username, password: action.password };
  }

  private handleError(err: ErrorFormat, message: string) {
    this.openSnackBar(message);
    return of(UserAction.USER_ERROR(err));
  }

  private openSnackBar(message: string) {
    this.notificationService.error(message);
  }
}
