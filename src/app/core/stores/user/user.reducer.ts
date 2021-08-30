import { createReducer, on } from '@ngrx/store';
import { undefinedUser } from '@testsUT/user/user-mock-data.model';
import { UserAction } from './user.actions';
import { User } from './user.model';

export const initialState: User = undefinedUser;

const _userReducer = createReducer(
  initialState,
  on(UserAction.REGISTER_REQUEST, (state, action) => ({ ...state, ...action })),
  on(UserAction.LOGIN_REQUEST, (state, action) => ({ ...state, ...action })),
  on(UserAction.USER_UPDATE, (state, action) => ({ ...state, ...action })),
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
