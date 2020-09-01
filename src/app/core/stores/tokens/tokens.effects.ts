import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Tokens } from './tokens.model';
import { TokensAction } from './tokens.actions';

@Injectable()
export class TokenEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TokensAction.LOGIN),
      tap((t) => console.log('tokens login', t))
    )
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
