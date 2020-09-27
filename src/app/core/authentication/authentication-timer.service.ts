import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TokensAction } from '@stores/tokens/tokens.actions';
import { NGXLogger } from 'ngx-logger';
import { Subscription, timer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { TokensStorageService } from './tokens-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationTimerService {
  private readonly signature = '[AUTHT.S]';
  private timer = new Subscription();
  private readonly expiresInDelta = 0.8;

  private readonly second = 1000;

  constructor(
    private logger: NGXLogger,
    private tokensStore: Store<AppState>,
    private tokensStorageService: TokensStorageService
  ) {}

  public start(): void {
    const expiresIn = this.tokensStorageService.getTokens().expires_in;
    this.clear();
    const timeToCallRefreshToken = this.calculateExpirationTime(expiresIn);
    this.logger.log(
      `${
        this.signature
      } starting refresh token timer.Expiration time: ${expiresIn}s. Time to call refresh token: ${
        timeToCallRefreshToken / this.second
      }s.`
    );
    this.timer = timer(timeToCallRefreshToken)
      .pipe(tap(() => this.tokensStore.dispatch(TokensAction.REFRESH_TOKENS_REQUEST())))
      .subscribe();
  }
  public clear(): void {
    this.logger.log(`${this.signature} clearing refresh token timer`);
    this.timer.unsubscribe();
  }

  private calculateExpirationTime(expiresIn: number): number {
    return this.expiresInDelta * expiresIn * this.second;
  }
}
