import { Tokens } from './tokens.model';
import { tokensReducer } from './tokens.reducer';
import { TokensAction } from './tokens.actions';
import { cloneDeep } from 'lodash';

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
    let newState = tokensReducer(
      initialState,
      TokensAction.LOGIN_REQUEST_SUCCESS(loginTokens)
    );
    expect(newState.access_token).toEqual(loginTokens.access_token);

    newState = tokensReducer(newState, TokensAction.REFRESH_TOKENS_REQUEST());
    expect(newState.access_token).toEqual(loginTokens.access_token);

    newState = tokensReducer(
      cloneDeep(newState),
      TokensAction.REFRESH_TOKENS_REQUEST_SUCCESS(updateTokens)
    );
    expect(newState.access_token).toEqual(updateTokens.access_token);

    newState = tokensReducer(
      cloneDeep(newState),
      TokensAction.REFRESH_TOKENS_REQUEST_FAILURE()
    );

    expect(newState.access_token).toEqual(updateTokens.access_token);

    newState = tokensReducer(
      cloneDeep(newState),
      TokensAction.CLEAR_TOKENS_REQUEST()
    );
    expect(newState.access_token).toEqual(null);

    newState = tokensReducer(
      cloneDeep(newState),
      TokensAction.CLEAR_TOKENS_REQUEST_SUCCESS()
    );
    expect(newState.access_token).toEqual(null);
  });
});
