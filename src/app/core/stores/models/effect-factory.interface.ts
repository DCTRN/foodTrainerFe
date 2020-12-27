import { TypedAction } from '@ngrx/store/src/models';
import { EffectHandler } from './effect-handler.interface';

export interface EffectFactory {
  createEffectHandler(action: TypedAction<string>): EffectHandler;
}
