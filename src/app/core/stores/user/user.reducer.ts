import { createReducer, on } from '@ngrx/store';
import { UserAction } from './user.actions';
import { User } from './user.model';

export const initialState: User = {
  id: undefined,
  username: undefined,
  email: undefined,
  birthDate: undefined,
  phoneNumber: undefined,
  firstName: undefined,
  lastName: undefined,
  authenticationLevel: undefined,
};

const _userReducer = createReducer(
  initialState,
  on(UserAction.REGISTER_REQUEST, (state, action) => action),
  on(UserAction.LOGIN_REQUEST, (state, action) => ({ ...state, ...action })),
  on(UserAction.USER_UPDATE, (state, action) => action),
  on(UserAction.GET_CREDENTIALS_REQUEST, (state) => state),
  on(UserAction.PATCH_CREDENTIALS_REQUEST, (state, action) => ({
    ...state,
    ...action,
  })),
  on(UserAction.USER_ERROR, (state) => ({ ...state }))
);

export function userReducer(state, action) {
  return _userReducer(state, action);
}
