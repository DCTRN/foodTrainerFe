import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';

export interface EffectHandler {
  handle(action?: Action): Observable<Action>;
}
