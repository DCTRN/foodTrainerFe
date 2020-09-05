import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { userReducer } from '@stores/user/user.reducer';
import { tokensReducer } from '@stores/tokens/tokens.reducer';

export interface State {}

export const reducers: ActionReducerMap<State> = {
  user: userReducer,
  tokens: tokensReducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? []
  : [];
