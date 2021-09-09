import { Friends } from '@core/stores/friends/friends.actions';
import { Products } from '@core/stores/products/products.actions';
import { productsReducer } from '@core/stores/products/products.reducer';
import { Tokens } from '@core/stores/tokens/tokens.model';
import { UserProducts } from '@core/stores/user-products/user-products.actions';
import { userProductsReducer } from '@core/stores/user-products/user-products.reducer';
import { User } from '@core/stores/user/user.model';
import { ReportTab } from '@main-content/reports/store/report-tab/report-tab.reducer';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { friendsReducer } from '@stores/friends/friends.reducer';
import { tokensReducer } from '@stores/tokens/tokens.reducer';
import { userReducer } from '@stores/user/user.reducer';
import { environment } from '../../environments/environment';

export interface AppStartupState {
  user: User;
  tokens: Tokens;
  friends: Friends;
  products: Products;
  userProducts: UserProducts;
}
export interface AppState extends AppStartupState {
  reportTab: ReportTab;
}

export const reducers: ActionReducerMap<AppStartupState> = {
  user: userReducer,
  tokens: tokensReducer,
  friends: friendsReducer,
  products: productsReducer,
  userProducts: userProductsReducer,
};

export const metaReducers: MetaReducer<AppStartupState>[] =
  !environment.production ? [] : [];
