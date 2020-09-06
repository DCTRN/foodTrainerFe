import { getTestBed, TestBed } from '@angular/core/testing';
import { TokensStorageService } from './tokens-storage.service';
import { Tokens } from '@stores/tokens/tokens.model';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { LocalStorageService } from 'ngx-webstorage';
import { NGXLogger } from 'ngx-logger';

const loginTokens: Tokens = {
  access_token: 'access_token_login',
  refresh_token: 'refresh_token_login',
  expires_in: 300,
};

describe('TokensStorageService', () => {
  let injector: TestBed;
  let service: TokensStorageService;
  let localStorageService: LocalStorageService;
  let logger: NGXLogger;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoggerTestingModule],
      providers: [LocalStorageService],
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    logger = injector.inject(NGXLogger);
    localStorageService = injector.inject(LocalStorageService);
    service = injector.inject(TokensStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set tokens storage', () => {
    let tokens: Tokens;
    const logSpy = spyOn(logger, 'log');
    const storeSpy = spyOn(localStorageService, 'store');

    service.setTokens(loginTokens);
    tokens = service.getTokens();

    expect(tokens.access_token).toEqual(loginTokens.access_token);
    expect(tokens.refresh_token).toEqual(loginTokens.refresh_token);
    expect(tokens.expires_in).toEqual(loginTokens.expires_in);
    expect(logSpy).toHaveBeenCalled();
    expect(storeSpy).toHaveBeenCalled();
  });
});
