import { TestBed, getTestBed, inject } from '@angular/core/testing';

import { LoggerInterceptor } from './logger.interceptor';
import { NGXLogger } from 'ngx-logger';
import { LoggerTestingModule } from 'ngx-logger/testing';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

describe('LoggerInterceptor', () => {
  let injector: TestBed;
  let logger: NGXLogger;
  let interceptor: LoggerInterceptor;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [LoggerTestingModule, HttpClientTestingModule],
      providers: [
        LoggerInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoggerInterceptor,
          multi: true,
        },
      ],
    })
  );

  beforeEach(() => {
    injector = getTestBed();
    logger = injector.inject(NGXLogger);
    interceptor = injector.inject(LoggerInterceptor);
    httpMock = injector.inject(HttpTestingController);
    httpClient = injector.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should logg request with its url', () => {
    const logSpy = spyOn(logger, 'log');

    const requestUrl = 'fakeUrl';
    httpClient.get(requestUrl).subscribe();
    httpMock.expectOne(requestUrl);
    expect(logSpy).toHaveBeenCalledTimes(2);
  });
});
