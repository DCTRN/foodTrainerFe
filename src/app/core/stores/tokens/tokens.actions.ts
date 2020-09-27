import { createAction, props } from '@ngrx/store';
import { Tokens } from './tokens.model';

const loginRequestType = '[TOKENS] LOGIN_REQUEST_SUCCESS';
const refreshTokensRequestType = '[TOKENS] REFRESH_TOKENS_REQUEST';
const refreshTokensRequestSuccessType =
  '[TOKENS] REFRESH_TOKENS_REQUEST_SUCCESS';
const refreshTokensRequestFailureType =
  '[TOKENS] REFRESH_TOKENS_REQUEST_FAILURE';
const clearTokensRequestType = '[TOKENS] CLEAR_TOKENS_REQUEST';
const clearTokensRequestSuccessType = '[TOKENS] CLEAR_TOKENS_REQUEST_SUCCESS';

const loginRequestSuccess = createAction(loginRequestType, props<Tokens>());
const refreshTokensRequest = createAction(refreshTokensRequestType);
const refreshTokensRequestSuccess = createAction(
  refreshTokensRequestSuccessType,
  props<Tokens>()
);
const refreshTokensRequestFailure = createAction(
  refreshTokensRequestFailureType
);
const clearTokensRequest = createAction(clearTokensRequestType);
const clearTokensRequestSuccess = createAction(clearTokensRequestSuccessType);

export const TokensActionType = {
  LOGIN_REQUEST_SUCCESS: loginRequestType,
  REFRESH_TOKENS_REQUEST: refreshTokensRequestType,
  REFRESH_TOKENS_REQUEST_SUCCESS: refreshTokensRequestSuccessType,
  REFRESH_TOKENS_REQUEST_FAILURE: refreshTokensRequestFailureType,
  CLEAR_TOKENS_REQUEST: clearTokensRequestType,
  CLEAR_TOKENS_REQUEST_SUCCESS: clearTokensRequestSuccessType,
};

export const TokensAction = {
  LOGIN_REQUEST_SUCCESS: loginRequestSuccess,
  REFRESH_TOKENS_REQUEST: refreshTokensRequest,
  REFRESH_TOKENS_REQUEST_SUCCESS: refreshTokensRequestSuccess,
  REFRESH_TOKENS_REQUEST_FAILURE: refreshTokensRequestFailure,
  CLEAR_TOKENS_REQUEST: clearTokensRequest,
  CLEAR_TOKENS_REQUEST_SUCCESS: clearTokensRequestSuccess,
};
