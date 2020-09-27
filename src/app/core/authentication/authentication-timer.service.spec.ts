import { fakeAsync, getTestBed, TestBed, tick } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TokensAction } from '@stores/tokens/tokens.actions';
import { Tokens } from '@stores/tokens/tokens.model';
import { AuthenticationTimerService } from './authentication-timer.service';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { Injectable } from '@angular/core';
import { TokensStorageService } from './tokens-storage.service';

export const initialState: Tokens = {
  access_token: undefined,
  refresh_token: undefined,
  expires_in: undefined,
};

const tokensMock: Tokens = {
  access_token: 'access_token_login',
  refresh_token: 'refresh_token_login',
  expires_in: 300,
};

@Injectable()
export class TokensStorageServiceMock {
  private tokens: Tokens = tokensMock;

  constructor() {}

  public setTokens(tokens: Tokens): void {
    this.tokens = tokens;
  }

  public getTokens(): Tokens {
    return this.tokens;
  }
}

describe('AuthenticationTimerService', () => {
  let injector: TestBed;
  let service: AuthenticationTimerService;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoggerTestingModule],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: TokensStorageService,
          useClass: TokensStorageServiceMock,
        },
      ],
    });
    injector = getTestBed();
    service = injector.inject(AuthenticationTimerService);
    store = injector.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should refresh token when timer expires', fakeAsync(() => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const clearSpy = spyOn(service, 'clear').and.callThrough();

    service.start();
    tick(240 * 1000);

    expect(dispatchSpy).toHaveBeenCalledWith(
      TokensAction.REFRESH_TOKENS_REQUEST()
    );
    expect(clearSpy).toHaveBeenCalled();
  }));

  it('should clear refresh token timer', fakeAsync(() => {
    const dispatchSpy = spyOn(store, 'dispatch');

    service.start();
    service.clear();
    tick(240 * 1000);

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      TokensAction.REFRESH_TOKENS_REQUEST()
    );
  }));

  it('should refresh token twice', fakeAsync(() => {
    const dispatchSpy = spyOn(store, 'dispatch');

    service.start();
    tick(240 * 1000);

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      TokensAction.REFRESH_TOKENS_REQUEST()
    );

    service.start();
    tick(240 * 1000);

    expect(dispatchSpy).toHaveBeenCalledTimes(2);
  }));

  it('should refresh token clear timer and refresh token', fakeAsync(() => {
    const dispatchSpy = spyOn(store, 'dispatch');

    service.start();
    tick(240 * 1000);

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      TokensAction.REFRESH_TOKENS_REQUEST()
    );

    service.clear();
    tick(240 * 1000);

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    service.start();
    tick(240 * 1000);

    expect(dispatchSpy).toHaveBeenCalledTimes(2);
  }));
});
