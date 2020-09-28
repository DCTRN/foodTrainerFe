import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { LoggerConfig, NGXLogger } from 'ngx-logger';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { Observable, ReplaySubject, of, throwError } from 'rxjs';
import { AuthenticationTimerService } from '../../authentication/authentication-timer.service';
import { AuthenticationService } from '../../authentication/authentication.service';
import { TokensAction } from './tokens.actions';
import { TokenEffects } from './tokens.effects';
import { Tokens } from './tokens.model';
import { TokensStorageService } from '../../authentication/tokens-storage.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

const tokensMock: Tokens = {
  access_token: 'access_token_login',
  refresh_token: 'refresh_token_login',
  expires_in: 300,
};

@Injectable()
class MatSnackBarMock {
  public open(
    message: string,
    action?: string,
    config?: MatSnackBarConfig
  ): MatSnackBarRef<TextOnlySnackBar> {
    return null;
  }
}

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

  public clearTokens(): void {}
}

@Injectable()
class AuthenticationServiceMock {
  public refreshToken(): Observable<Tokens> {
    return null;
  }
}

@Injectable()
class AuthenticationTimerServiceMock {
  public start(): void {}
  public clear(): void {}
}

describe('Tokens effects', () => {
  let injector: TestBed;
  let service: TokenEffects;
  let authenticationTimerService: AuthenticationTimerService;
  let authenticationService: AuthenticationService;
  let tokensStorageService: TokensStorageService;
  let router: Router;
  let matSnackBar: MatSnackBar;
  let actions$: ReplaySubject<any> = new ReplaySubject(1);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
        RouterTestingModule,
      ],
      providers: [
        TokenEffects,
        provideMockActions(() => actions$),
        NGXLogger,
        LoggerConfig,
        {
          provide: AuthenticationService,
          useClass: AuthenticationServiceMock,
        },
        {
          provide: AuthenticationTimerService,
          useClass: AuthenticationTimerServiceMock,
        },
        {
          provide: TokensStorageService,
          useClass: TokensStorageServiceMock,
        },
        {
          provide: MatSnackBar,
          useClass: MatSnackBarMock,
        },
      ],
    });

    injector = getTestBed();
    authenticationService = injector.inject(AuthenticationService);
    authenticationTimerService = injector.inject(AuthenticationTimerService);
    tokensStorageService = injector.inject(TokensStorageService);
    matSnackBar = injector.inject(MatSnackBar);
    router = injector.inject(Router);
    service = injector.inject(TokenEffects);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle tokens refresh action', () => {
    let resultAction: any;
    const refreshTokenSpy = spyOn(
      authenticationService,
      'refreshToken'
    ).and.returnValue(of(tokensMock));
    const startSpy = spyOn(authenticationTimerService, 'start');
    const setTokensSpy = spyOn(tokensStorageService, 'setTokens');
    actions$.next(TokensAction.REFRESH_TOKENS_REQUEST());

    service.refresh$.subscribe((action) => (resultAction = action));

    expect(refreshTokenSpy).toHaveBeenCalled();
    expect(startSpy).toHaveBeenCalled();
    expect(setTokensSpy).toHaveBeenCalledWith(tokensMock);
    expect(resultAction).toEqual(
      TokensAction.REFRESH_TOKENS_REQUEST_SUCCESS(tokensMock)
    );
  });

  it('should fail to refresh token', () => {
    let resultAction: any;
    const refreshTokenSpy = spyOn(
      authenticationService,
      'refreshToken'
    ).and.returnValue(throwError('Error'));
    const startSpy = spyOn(authenticationTimerService, 'start');
    const setTokensSpy = spyOn(tokensStorageService, 'setTokens');
    const openSpy = spyOn(matSnackBar, 'open');

    actions$.next(TokensAction.REFRESH_TOKENS_REQUEST());
    service.refresh$.subscribe((action) => (resultAction = action));

    expect(refreshTokenSpy).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalled();
    expect(startSpy).not.toHaveBeenCalled();
    expect(setTokensSpy).not.toHaveBeenCalled();
    expect(resultAction()).toEqual(TokensAction.CLEAR_TOKENS_REQUEST());
  });

  it('should handle tokens refresh action', () => {
    let resultAction: any;
    const clearSpy = spyOn(authenticationTimerService, 'clear');
    const clearTokensSpy = spyOn(tokensStorageService, 'clearTokens');
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    actions$.next(TokensAction.CLEAR_TOKENS_REQUEST());
    service.clear$.subscribe((action) => (resultAction = action));

    expect(clearSpy).toHaveBeenCalled();
    expect(clearTokensSpy).toHaveBeenCalled();
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/login');
    expect(resultAction).toEqual(TokensAction.CLEAR_TOKENS_REQUEST_SUCCESS());
  });
});
