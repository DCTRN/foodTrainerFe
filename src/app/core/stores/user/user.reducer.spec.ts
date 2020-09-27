import { userReducer, initialState } from './user.reducer';
import { UserAction } from './user.actions';
import { User } from './user.model';

export const userMock: User = {
  username: 'mike8',
  password: 'haslo1234',
  email: 'michal.kowalski@gmail.com',
  phoneNumber: '123123123',
  birthDate: null,
  firstName: 'majkel',
  lastName: 'majk',
};

const loginCredentialsMock = {
  username: 'newUsername',
  password: 'newPassword',
};

describe('userReducer', () => {
  it('should test user reducer', () => {
    const newEmail = 'newEmail@gmail.com';

    let newState = userReducer(initialState, UserAction.REGISTER_REQUEST(userMock));
    expect(newState.username).toEqual(userMock.username);

    newState = userReducer(newState, UserAction.USER_ERROR(userMock));
    expect(newState.username).toEqual(userMock.username);

    newState = userReducer(newState, UserAction.LOGIN_REQUEST(loginCredentialsMock));
    expect(newState.username).toEqual(loginCredentialsMock.username);
    expect(newState.password).toEqual(loginCredentialsMock.password);

    userMock.email = newEmail;
    newState = userReducer(newState, UserAction.USER_UPDATE(userMock));
    expect(newState.email).toEqual(newEmail);
  });
});
