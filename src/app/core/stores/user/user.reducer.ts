import { createReducer, on } from '@ngrx/store';
import { UserAction } from './user.actions';
import { User } from './user.model';

export const initialState: User = {
  username: undefined,
  email: undefined,
  birthDate: undefined,
  phoneNumber: undefined,
  firstName: undefined,
  lastName: undefined,
  id: undefined,
  authenticationLevel: undefined,
};

const _userReducer = createReducer(
  initialState,
  on(UserAction.REGISTER, (state, action) => action),
  on(UserAction.LOGIN, (state, action) => ({ ...state, ...action })),
  on(UserAction.UPDATE, (state, action) => action),
  on(UserAction.ERROR, (state, action) => state)
);

export function userReducer(state, action) {
  return _userReducer(state, action);
}
