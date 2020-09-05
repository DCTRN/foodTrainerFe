import { createReducer, on } from '@ngrx/store';
import { Tokens } from './tokens.model';
import { login, refresh, update, error } from './tokens.actions';

export const initialState: Tokens = {
  access_token: undefined,
  refresh_token: undefined,
  expires_in: undefined,
};

const _tokensReducer = createReducer(
  initialState,
  on(login, (state, action) => action),
  on(refresh, (state) => state),
  on(update, (state, action) => action),
  on(error, (state) => state)
);

export function tokensReducer(state, action) {
  return _tokensReducer(state, action);
}
