import { Injectable } from '@angular/core';
import { Tokens } from '@stores/tokens/tokens.model';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root',
})
export class TokensStorageService {
  private readonly signature = '[TS.S]';
  private tokens: Tokens;

  constructor(private logger: NGXLogger) {}

  public setTokens(tokens: Tokens): void {
    this.logger.log(`${this.signature} setting tokens: ${tokens}`);
    this.tokens = tokens;
  }

  public getTokens(): Tokens {
    return this.tokens;
  }
}
