import { Injectable } from '@angular/core';
import { Tokens } from '@stores/tokens/tokens.model';
import { NGXLogger } from 'ngx-logger';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root',
})
export class TokensStorageService {
  private readonly signature = '[TS.S]';
  private tokens: Tokens;

  private readonly tokensKey = 'tokens';
  private readonly usernameKey = 'username';

  constructor(
    private logger: NGXLogger,
    private localStorageService: LocalStorageService
  ) {}

  public setTokens(tokens: Tokens): void {
    this.logger.log(
      `${this.signature} setting tokens: ${JSON.stringify(tokens)}`
    );
    this.localStorageService.store(this.tokensKey, tokens);
    this.tokens = tokens;
  }

  public getTokens(): Tokens {
    return this.tokens;
  }

  public clearTokens(): void {
    this.logger.log(`${this.signature} clearing tokens`);
    this.localStorageService.clear(this.tokensKey);
    this.localStorageService.clear(this.usernameKey);
    this.tokens = null;
  }

  public getUsername(): string {
    return this.localStorageService.retrieve(this.usernameKey) as string;
  }

  public setUsername(username: string): void {
    this.logger.log(
      `${this.signature} setting username: ${JSON.stringify(username)}`
    );
    this.localStorageService.store(this.usernameKey, username);
  }
}
