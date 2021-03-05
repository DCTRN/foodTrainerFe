import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements HttpInterceptor {
  private readonly signature = '[HTTP]';
  constructor(private logger: NGXLogger) {}

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.logger.log(`${this.signature} >>> ${request.url}`);
    return next
      .handle(request)
      .pipe(tap(() => this.logger.log(`${this.signature} <<< ${request.url}`)));
  }
}
