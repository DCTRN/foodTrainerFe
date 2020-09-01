import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, mergeMap, tap, map } from 'rxjs/operators';
import { LoginCredentials } from 'src/app/api/authentication/login-credentials.model';
import { AuthenticationService } from '../../authentication/authentication.service';
import { UserAction, update } from './user.actions';
import { User } from './user.model';
import { Tokens } from '../tokens/tokens.model';
import { TokensAction } from '../tokens/tokens.actions';

@Injectable()
export class UserEffects {
  public register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAction.REGISTER),
      mergeMap((action: User) => {
        return this.authenticationService.register(action).pipe(
          catchError((err) => of(UserAction.ERROR(err))),
          map((user: User) => update(user))
        );
      })
    )
  );

  public login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAction.LOGIN),
      tap(() => console.log('ATTEMPTING TO LOGIN')),
      mergeMap((action: LoginCredentials) => {
        return this.authenticationService
          .login({ username: action.username, password: action.password })
          .pipe(
            tap(() => console.log('LOGIN')),
            catchError((err) => of(UserAction.ERROR(err))),
            tap((t) => console.log('LOGIN TOKENS', t)),
            map((tokens: Tokens) => TokensAction.LOGIN(tokens))
          );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private authenticationService: AuthenticationService
  ) {}
}
