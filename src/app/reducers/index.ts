import { Friends } from '@core/stores/friends/friends.actions';
import { Products } from '@core/stores/products/products.actions';
import { productsReducer } from '@core/stores/products/products.reducer';
import { Tokens } from '@core/stores/tokens/tokens.model';
import { UserProducts } from '@core/stores/user-products/user-products.actions';
import { userProductsReducer } from '@core/stores/user-products/user-products.reducer';
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
  products: Products;
  userProducts: UserProducts;
}

export interface State {}

export const reducers: ActionReducerMap<State> = {
  user: userReducer,
  tokens: tokensReducer,
  friends: friendsReducer,
  products: productsReducer,
  userProducts: userProductsReducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? []
  : [];
