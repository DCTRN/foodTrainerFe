import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, mergeMap, tap, map } from 'rxjs/operators';
import { AuthenticationService } from '../../authentication/authentication.service';
import { UserAction, update, UserActionType } from './user.actions';
import { User } from './user.model';
import { Tokens } from '../tokens/tokens.model';
import { TokensAction } from '../tokens/tokens.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { LoginCredentials } from '@api/authentication/login-credentials.model';
import { ErrorFormat } from '@core/models/error-format.model';

@Injectable()
export class UserEffects {
  public register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAction.REGISTER),
      tap(() =>
        this.logger.log(`${this.signature} Handling ${UserActionType.REGISTER}`)
      ),
      mergeMap((action: User) => {
        return this.authenticationService.register(action).pipe(
          map((user: User) => update(user)),
          tap(() => this.openSnackBar('Registered successfuly! Now you can log in^^')),
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
      ofType(UserAction.LOGIN),
      tap(() =>
        this.logger.log(`${this.signature} Handling ${UserActionType.LOGIN}`)
      ),
      mergeMap((action: LoginCredentials) => {
        return this.authenticationService
          .login(this.createLoginCredentials(action))
          .pipe(
            map((tokens: Tokens) => TokensAction.LOGIN(tokens)),
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
    private snackBar: MatSnackBar,
    private router: Router,
    private logger: NGXLogger
  ) {}

  private createLoginCredentials(action: LoginCredentials): LoginCredentials {
    return { username: action.username, password: action.password };
  }

  private handleError(err: ErrorFormat, message: string) {
    this.openSnackBar(message);
    return of(UserAction.ERROR(err));
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
    });
  }
}
