import { createAction, props } from '@ngrx/store';
import { User } from './user.model';

export const registerRequestType = '[USER] REGISTER_REQUEST';
export const loginRequestType = '[USER] LOGIN_REQUEST';
export const userUpdateType = '[USER] USER_UPDATE';
export const userRrrorType = '[USER] USER_ERROR';

export const registerRequest = createAction(registerRequestType, props<User>());
export const loginRequest = createAction(
  loginRequestType,
  props<{ username: string; password: string }>()
);
export const userUpdate = createAction(userUpdateType, props<User>());
export const userError = createAction(userRrrorType, props<any>());

export const UserActionType = {
  REGISTER_REQUEST: registerRequestType,
  LOGIN_REQUEST: loginRequestType,
  USER_UPDATE: userUpdateType,
  USER_ERROR: userRrrorType,
};

export const UserAction = {
  REGISTER_REQUEST: registerRequest,
  LOGIN_REQUEST: loginRequest,
  USER_UPDATE: userUpdate,
  USER_ERROR: userError,
};
