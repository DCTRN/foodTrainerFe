import { Tokens } from './tokens.model';
import { tokensReducer } from './tokens.reducer';
import { TokensAction } from './tokens.actions';

const initialState: Tokens = {
  access_token: undefined,
  refresh_token: undefined,
  expires_in: undefined,
};

const loginTokens: Tokens = {
  access_token: 'access_token_login',
  refresh_token: 'refresh_token_login',
  expires_in: 300,
};

const updateTokens: Tokens = {
  access_token: 'access_token_update',
  refresh_token: 'refresh_token_update',
  expires_in: 300,
};

describe('tokens reducer', () => {
  it('should test tokens reducer', () => {
    let newState = tokensReducer(initialState, TokensAction.LOGIN(loginTokens));
    expect(newState.access_token).toEqual(loginTokens.access_token);

    newState = tokensReducer(newState, TokensAction.REFRESH());
    expect(newState.access_token).toEqual(loginTokens.access_token);

    newState = tokensReducer(newState, TokensAction.UPDATE(updateTokens));
    expect(newState.access_token).toEqual(updateTokens.access_token);

    newState = tokensReducer(newState, TokensAction.ERROR('Error'));
    expect(newState.access_token).toEqual(updateTokens.access_token);
  });
});
