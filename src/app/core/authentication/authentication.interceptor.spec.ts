import { TestBed, getTestBed } from '@angular/core/testing';
import { AuthenticationInterceptor } from './authentication.interceptor';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TokensStorageService } from './tokens-storage.service';
import { LoggerTestingModule } from 'ngx-logger/testing';

export const tokensMock = {
  access_token: 'access_token',
  refresh_token: 'refresh_token',
  expires_in: 300,
};

describe('AuthenticationInterceptor', () => {
  let injector: TestBed;
  let interceptor: AuthenticationInterceptor;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let tokensStorageService: TokensStorageService;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        LoggerTestingModule,
      ],
      providers: [
        AuthenticationInterceptor,
        TokensStorageService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthenticationInterceptor,
          multi: true,
        },
      ],
    })
  );

  beforeEach(() => {
    injector = getTestBed();
    httpMock = injector.inject(HttpTestingController);
    httpClient = injector.inject(HttpClient);
    tokensStorageService = injector.inject(TokensStorageService);
    interceptor = injector.inject(AuthenticationInterceptor);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add authorization header', () => {
    const getTokensSpy = spyOn(
      tokensStorageService,
      'getTokens'
    ).and.returnValue(tokensMock);

    httpClient.get('fakeUrl').subscribe();

    const request = httpMock.expectOne('fakeUrl');
    expect(request.request.headers.get('Authorization')).toEqual(
      `Bearer ${tokensMock.access_token}`
    );
    request.flush({});
    expect(getTokensSpy).toHaveBeenCalled();
  });
});
