import { createReducer, on } from '@ngrx/store';
import { Tokens } from './tokens.model';
import { login, refresh, update } from './tokens.actions';

export const initialState: Tokens = {
  access_token: undefined,
  refresh_token: undefined,
  expires_in: undefined,
};

const _tokensReducer = createReducer(
  initialState,
  on(login, (state, action) => {
    console.log('tokens reducer', action);
    return action;
  }),
  on(refresh, (state, action) => action),
  on(update, (state, action) => action)
);

export function tokensReducer(state, action) {
  return _tokensReducer(state, action);
}
