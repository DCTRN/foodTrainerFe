import { createAction, props } from '@ngrx/store';
import { Tokens } from './tokens.model';

export const loginTokens = '[Tokens] Login tokens';
export const refreshTokens = '[Tokens] Refresh tokens';
export const updateTokens = '[Tokens] Refresh tokens update';

export const login = createAction(loginTokens, props<Tokens>());
export const refresh = createAction(refreshTokens, props<Tokens>());
export const update = createAction(updateTokens, props<Tokens>());

export const TokensActionType = {
  REFRESH: refreshTokens,
  LOGIN: loginTokens,
  UPDATE: updateTokens,
};

export const TokensAction = {
  REFRESH: refresh,
  LOGIN: login,
  UPDATE: update,
};
