import { createReducer, on } from '@ngrx/store';
import { TokensAction } from './tokens.actions';
import { Tokens } from './tokens.model';

export const initialState: Tokens = {
  access_token: undefined,
  refresh_token: undefined,
  expires_in: undefined,
};

export const clearState: Tokens = {
  access_token: null,
  refresh_token: null,
  expires_in: null,
};

const _tokensReducer = createReducer(
  initialState,
  on(TokensAction.LOGIN_REQUEST_SUCCESS, (state, action) => ({ ...action })),
  on(TokensAction.REFRESH_TOKENS_REQUEST, (state) => ({ ...state })),
  on(TokensAction.REFRESH_TOKENS_REQUEST_SUCCESS, (state, action) => ({
    ...action,
  })),
  on(TokensAction.REFRESH_TOKENS_REQUEST_FAILURE, (state) => ({ ...state })),
  on(TokensAction.CLEAR_TOKENS_REQUEST, () => ({ ...clearState })),
  on(TokensAction.CLEAR_TOKENS_REQUEST_SUCCESS, (state) => ({ ...state }))
);

export function tokensReducer(state, action) {
  return _tokensReducer(state, action);
}
