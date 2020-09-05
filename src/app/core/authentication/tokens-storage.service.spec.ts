import { getTestBed, TestBed } from '@angular/core/testing';
import { TokensStorageService } from './tokens-storage.service';
import { Tokens } from '@stores/tokens/tokens.model';

const loginTokens: Tokens = {
  access_token: 'access_token_login',
  refresh_token: 'refresh_token_login',
  expires_in: 300,
};

describe('TokensStorageService', () => {
  let injector: TestBed;
  let service: TokensStorageService;

  beforeEach(() => {
    injector = getTestBed();
    TestBed.configureTestingModule({});
    service = injector.inject(TokensStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set tokens storage', () => {
    let tokens: Tokens;

    service.setTokens(loginTokens);
    tokens = service.getTokens();

    expect(tokens.access_token).toEqual(loginTokens.access_token);
    expect(tokens.refresh_token).toEqual(loginTokens.refresh_token);
    expect(tokens.expires_in).toEqual(loginTokens.expires_in);
  });
});
