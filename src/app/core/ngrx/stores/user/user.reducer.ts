import { createReducer, on } from '@ngrx/store';
import { User } from './user.model';
import { register, login, update } from './user.actions';

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
  on(register, (state, action) => action),
  on(login, (state, action) => {
    return { ...state, ...action };
  }),
  on(update, (state, action) => action)
);

export function userReducer(state, action) {
  return _userReducer(state, action);
}
