import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { registerType, update } from './user.actions';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';

@Injectable()
export class UserEffects {
  loadMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerType),
      mergeMap((action) => {
        console.log('UserEffects', action);
        return this.http
          .post('http://localhost:4000/auth/register', action)
          .pipe(mergeMap((user) => of(update(user as User))));
      })
    )
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
