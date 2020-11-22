import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginCredentials } from '@api/authentication/login-credentials.model';
import { UserApiService } from '@api/user/user-api.service';
import { AuthenticationTimerService } from '@core/authentication/authentication-timer.service';
import { TokensStorageService } from '@core/authentication/tokens-storage.service';
import { ErrorFormat } from '@core/models/error-format.model';
import { NotificationService } from '@core/notifications/service/notification.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NGXLogger } from 'ngx-logger';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { AuthenticationService } from '../../authentication/authentication.service';
import { TokensAction } from '../tokens/tokens.actions';
import { Tokens } from '../tokens/tokens.model';
import { UserAction, UserActionType, userUpdate } from './user.actions';
import { User } from './user.model';

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
            this.notificationService.success(
              'Registered successfully! Now you can log in^^'
            )
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

  public getCredentials$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAction.GET_CREDENTIALS_REQUEST),
      tap(() =>
        this.logger.log(
          `${this.signature} Handling ${UserActionType.GET_CREDENTIALS_REQUEST}`
        )
      ),
      mergeMap(() => {
        return this.userApiService
          .getUserCredentialsByUsername(this.tokensStorageService.getUsername())
          .pipe(map((user: User) => UserAction.USER_UPDATE(user)));
      }),
      catchError((err) => this.handleError(err, this.credentialsFetchError))
    )
  );

  public patchCredentials$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAction.PATCH_CREDENTIALS_REQUEST),
      tap(() =>
        this.logger.log(
          `${this.signature} Handling ${UserActionType.PATCH_CREDENTIALS_REQUEST}`
        )
      ),
      mergeMap((action) => {
        return this.userApiService.updateUserCredentials(action).pipe(
          map((user: User) => UserAction.USER_UPDATE(user)),
          tap(() =>
            this.notificationService.success(
              'Successfully updated credentials!'
            )
          ),
          catchError((err) =>
            this.handleError(err, `Failed to update credentials`)
          )
        );
      })
    )
  );

  private readonly signature = '[U.E]';
  private readonly failedLoginMessage = 'Failed to login. Please try again.';
  private readonly failedRegisterMessage =
    '. Failed to register. Please try again.';
  private readonly credentialsFetchError =
    'Failed to fetch user credentials due to internal error.';

  constructor(
    private actions$: Actions,
    private authenticationService: AuthenticationService,
    private authenticationTimerService: AuthenticationTimerService,
    private tokensStorageService: TokensStorageService,
    private userApiService: UserApiService,
    private notificationService: NotificationService,
    private router: Router,
    private logger: NGXLogger
  ) {}

  private createLoginCredentials(action: LoginCredentials): LoginCredentials {
    this.tokensStorageService.setUsername(action.username);
    return { username: action.username, password: action.password };
  }

  private handleError(err: ErrorFormat, message: string) {
    this.openSnackBar(`${message} ${err.errorDescription}.`);
    return of(UserAction.USER_ERROR(err));
  }

  private openSnackBar(message: string) {
    this.notificationService.error(message);
  }
}
