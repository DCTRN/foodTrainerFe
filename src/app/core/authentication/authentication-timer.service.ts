import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, timer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TokensAction } from '../stores/tokens/tokens.actions';
import { Tokens } from '../stores/tokens/tokens.model';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationTimerService {
  private readonly signature = '[AUTHT.S]';
  private timer = new Subscription();
  constructor(
    private logger: NGXLogger,
    private tokensStore: Store<{ tokens: Tokens }>
  ) {}

  public start(): void {
    this.clear();
    this.logger.log(`${this.signature} starting refresh token timer`);
    this.timer = timer(240 * 1000)
      .pipe(tap(() => this.tokensStore.dispatch(TokensAction.REFRESH())))
      .subscribe();
  }

  public clear(): void {
    this.logger.log(`${this.signature} clearing refresh token timer`);
    this.timer.unsubscribe();
  }
}
