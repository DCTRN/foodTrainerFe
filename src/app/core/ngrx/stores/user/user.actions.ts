import { createAction, props } from '@ngrx/store';
import { User } from './user.model';

export const registerType = '[User] Register';
export const loginType = '[User] Login';
export const updateType = '[User] Update';

export const register = createAction(registerType, props<User>());
export const login = createAction(
  loginType,
  props<{ username: string; password: string }>()
);
export const update = createAction(updateType, props<User>());
