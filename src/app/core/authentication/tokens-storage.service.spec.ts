import { getTestBed, TestBed } from '@angular/core/testing';
import { Tokens } from '@stores/tokens/tokens.model';
import { NGXLogger } from 'ngx-logger';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { LocalStorageService } from 'ngx-webstorage';
import { TokensStorageService } from './tokens-storage.service';

const loginTokens: Tokens = {
  access_token: 'access_token_login',
  refresh_token: 'refresh_token_login',
  expires_in: 300,
};

class LocalStorageServiceMock {
  public retrieve(key: string): any {}
  public store(key: string, value: any): any {}
  public clear(key?: string): void {}
}

describe('TokensStorageService', () => {
  let injector: TestBed;
  let service: TokensStorageService;
  let localStorageService: LocalStorageService;
  let logger: NGXLogger;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoggerTestingModule],
      providers: [
        {
          provide: LocalStorageService,
          useClass: LocalStorageServiceMock,
        },
      ],
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

  it('should clear storage', () => {
    let tokens: Tokens;
    const logSpy = spyOn(logger, 'log');
    const storeSpy = spyOn(localStorageService, 'store');
    const clearSpy = spyOn(localStorageService, 'clear');

    service.setTokens(loginTokens);
    service.clearTokens();
    tokens = service.getTokens();

    expect(tokens).toBeFalsy();
    expect(logSpy).toHaveBeenCalled();
    expect(storeSpy).toHaveBeenCalled();
    expect(clearSpy).toHaveBeenCalledTimes(2);
    expect(clearSpy).toHaveBeenCalledWith('tokens');
    expect(clearSpy).toHaveBeenCalledWith('username');
  });

  it('should set and get username', () => {
    let tokens: Tokens;
    const logSpy = spyOn(logger, 'log');
    const storeSpy = spyOn(localStorageService, 'store');
    const retrieveSpy = spyOn(localStorageService, 'retrieve');

    service.setUsername('username');
    service.getUsername();

    expect(logSpy).toHaveBeenCalled();
    expect(storeSpy).toHaveBeenCalled();
    expect(retrieveSpy).toHaveBeenCalled();
  });
});
