import { createAction, props } from '@ngrx/store';
import { Tokens } from './tokens.model';

export const loginTokens = '[Tokens] Login tokens';
export const refreshTokens = '[Tokens] Refresh tokens';
export const updateTokens = '[Tokens] Refresh tokens update';
export const errorTokens = '[Tokens] Error';

export const login = createAction(loginTokens, props<Tokens>());
export const refresh = createAction(refreshTokens);
export const update = createAction(updateTokens, props<Tokens>());
export const error = createAction(errorTokens, props<any>());

export const TokensActionType = {
  REFRESH: refreshTokens,
  LOGIN: loginTokens,
  UPDATE: updateTokens,
  ERROR: errorTokens,
};

export const TokensAction = {
  REFRESH: refresh,
  LOGIN: login,
  UPDATE: update,
  ERROR: error,
};
