import { Injectable } from '@angular/core';
import { EffectHandler } from '@core/stores/models/effect-handler.interface';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { ProductsAction } from '../../products.actions';

@Injectable({
  providedIn: 'root',
})
export class InternalErrorHandlerService implements EffectHandler {
  public handle(action?: Action): Observable<Action> {
    return of(ProductsAction.INTERNAL_ERROR());
  }
}
