import { createAction, props } from '@ngrx/store';
import { User } from './user.model';

export const registerType = '[User] Register';
export const loginType = '[User] Login';
export const updateType = '[User] Update';
export const errorType = '[User] Error';

export const register = createAction(registerType, props<User>());
export const login = createAction(
  loginType,
  props<{ username: string; password: string }>()
);
export const update = createAction(updateType, props<User>());
export const error = createAction(errorType, props<any>());

export const UserActionType = {
  REGISTER: registerType,
  LOGIN: loginType,
  UPDATE: updateType,
  ERROR: errorType,
};

export const UserAction = {
  REGISTER: register,
  LOGIN: login,
  UPDATE: update,
  ERROR: error,
};
