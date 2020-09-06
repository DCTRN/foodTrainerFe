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

  constructor(
    private logger: NGXLogger,
    private localStorageService: LocalStorageService
  ) {}

  public setTokens(tokens: Tokens): void {
    this.logger.log(`${this.signature} setting tokens: ${tokens}`);
    this.localStorageService.store('tokens', tokens);
    this.tokens = tokens;
  }

  public getTokens(): Tokens {
    return this.tokens;
  }
}
