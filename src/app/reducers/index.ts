import { Friends } from '@core/stores/friends/friends.actions';
import { Tokens } from '@core/stores/tokens/tokens.model';
import { User } from '@core/stores/user/user.model';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { friendsReducer } from '@stores/friends/friends.reducer';
import { tokensReducer } from '@stores/tokens/tokens.reducer';
import { userReducer } from '@stores/user/user.reducer';
import { environment } from '../../environments/environment';

export interface AppState {
  user: User;
  tokens: Tokens;
  friends: Friends;
}

export interface State {}

export const reducers: ActionReducerMap<State> = {
  user: userReducer,
  tokens: tokensReducer,
  friends: friendsReducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? []
  : [];
