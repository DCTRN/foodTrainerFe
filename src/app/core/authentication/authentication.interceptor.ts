import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokensStorageService } from './tokens-storage.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(private tokensStorageService: TokensStorageService) {}

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    request = this.authorizationHeaderHandler(request);
    return next.handle(request);
  }

  private authorizationHeaderHandler(request: HttpRequest<unknown>) {
    const tokens = this.tokensStorageService.getTokens();
    if (tokens) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });
    }
    return request;
  }
}
