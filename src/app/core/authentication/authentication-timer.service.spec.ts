import { fakeAsync, getTestBed, TestBed, tick } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TokensAction } from '@stores/tokens/tokens.actions';
import { Tokens } from '@stores/tokens/tokens.model';
import { AuthenticationTimerService } from './authentication-timer.service';

export const initialState: Tokens = {
  access_token: undefined,
  refresh_token: undefined,
  expires_in: undefined,
};

describe('AuthenticationTimerService', () => {
  let injector: TestBed;
  let service: AuthenticationTimerService;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })],
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

    expect(dispatchSpy).toHaveBeenCalledWith(TokensAction.REFRESH());
    expect(clearSpy).toHaveBeenCalled();
  }));

  it('should clear refresh token timer', fakeAsync(() => {
    const dispatchSpy = spyOn(store, 'dispatch');

    service.start();
    service.clear();
    tick(240 * 1000);

    expect(dispatchSpy).not.toHaveBeenCalledWith(TokensAction.REFRESH());
  }));

  it('should refresh token twice', fakeAsync(() => {
    const dispatchSpy = spyOn(store, 'dispatch');

    service.start();
    tick(240 * 1000);

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(TokensAction.REFRESH());

    service.start();
    tick(240 * 1000);

    expect(dispatchSpy).toHaveBeenCalledTimes(2);
  }));

  it('should refresh token clear timer and refresh token', fakeAsync(() => {
    const dispatchSpy = spyOn(store, 'dispatch');

    service.start();
    tick(240 * 1000);

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(TokensAction.REFRESH());

    service.clear();
    tick(240 * 1000);

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    service.start();
    tick(240 * 1000);

    expect(dispatchSpy).toHaveBeenCalledTimes(2);
  }));
});
