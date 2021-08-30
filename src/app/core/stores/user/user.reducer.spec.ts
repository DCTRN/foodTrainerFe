import { userReducer, initialState } from './user.reducer';
import { UserAction } from './user.actions';
import { User } from './user.model';
import { user1, user2 } from '@testsUT/user/user-mock-data.model';

export const userMock: User = user1;
export const userMockChanged: User = user2;

const loginCredentialsMock = {
  username: 'newUsername',
  password: 'newPassword',
};

describe('userReducer', () => {
  it('should test user reducer', () => {
    const newEmail = 'newEmail@gmail.com';

    let newState = userReducer(
      initialState,
      UserAction.REGISTER_REQUEST(userMock)
    );
    expect(newState.username).toEqual(userMock.username);

    newState = userReducer(newState, UserAction.USER_ERROR(userMock));
    expect(newState.username).toEqual(userMock.username);

    newState = userReducer(
      newState,
      UserAction.LOGIN_REQUEST(loginCredentialsMock)
    );
    expect(newState.username).toEqual(loginCredentialsMock.username);
    expect(newState.password).toEqual(loginCredentialsMock.password);

    userMock.email = newEmail;
    newState = userReducer(newState, UserAction.USER_UPDATE(userMock));
    expect(newState.email).toEqual(newEmail);
  });

  it('should test user reducer get credentials request', () => {
    const userAfterCredentialsRequest = userReducer(
      userMock,
      UserAction.GET_CREDENTIALS_REQUEST()
    );
    expect(userAfterCredentialsRequest.username).toEqual(userMock.username);
    expect(userAfterCredentialsRequest.email).toEqual(userMock.email);
  });

  it('should test user reducer patch credentials request', () => {
    const userAfterCredentialsRequest = userReducer(
      userMock,
      UserAction.PATCH_CREDENTIALS_REQUEST(userMockChanged)
    );
    expect(userAfterCredentialsRequest.username).toEqual(userMockChanged.username);
    expect(userAfterCredentialsRequest.firstName).toEqual(userMockChanged.firstName);
    expect(userAfterCredentialsRequest.lastName).toEqual(userMockChanged.lastName);
  });
});
