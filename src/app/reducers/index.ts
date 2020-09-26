import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { userReducer } from '@stores/user/user.reducer';
import { tokensReducer } from '@stores/tokens/tokens.reducer';
import { Tokens } from '@core/stores/tokens/tokens.model';
import { User } from '@core/stores/user/user.model';

export interface AppState {
  user: User;
  tokens: Tokens;
}

export interface State {}

export const reducers: ActionReducerMap<State> = {
  user: userReducer,
  tokens: tokensReducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? []
  : [];
