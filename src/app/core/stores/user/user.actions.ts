import { UserFromForm } from '@itf/user-utility-types.model';
import { createAction, props } from '@ngrx/store';
import { User } from './user.model';

export const registerRequestType = '[USER] REGISTER_REQUEST';
export const loginRequestType = '[USER] LOGIN_REQUEST';
export const getCredentialsRequestType = '[USER] GET_CREDENTIALS_REQUEST';
export const patchCredentialsRequestType = '[USER] PATCH_CREDENTIALS_REQUEST';
export const updateType = '[USER] USER_UPDATE';
export const errorType = '[USER] USER_ERROR';

export const registerRequest = createAction(
  registerRequestType,
  props<UserFromForm>()
);
export const loginRequest = createAction(
  loginRequestType,
  props<{ username: string; password: string }>()
);
export const userUpdate = createAction(updateType, props<Partial<User>>());
export const userError = createAction(errorType, props<any>());
export const getCredentialsRequest = createAction(getCredentialsRequestType);
export const patchCredentialsRequest = createAction(
  patchCredentialsRequestType,
  props<Partial<User>>()
);

export const UserActionType = {
  REGISTER_REQUEST: registerRequestType,
  LOGIN_REQUEST: loginRequestType,
  GET_CREDENTIALS_REQUEST: getCredentialsRequestType,
  PATCH_CREDENTIALS_REQUEST: patchCredentialsRequestType,
  USER_UPDATE: updateType,
  USER_ERROR: errorType,
};

export const UserAction = {
  REGISTER_REQUEST: registerRequest,
  LOGIN_REQUEST: loginRequest,
  GET_CREDENTIALS_REQUEST: getCredentialsRequest,
  PATCH_CREDENTIALS_REQUEST: patchCredentialsRequest,
  USER_UPDATE: userUpdate,
  USER_ERROR: userError,
};
