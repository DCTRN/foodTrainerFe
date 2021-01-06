import { Product } from '@core/models/products';
import { createReducer, on } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { UserProducts, UserProductsAction } from './user-products.actions';

export const initialState: UserProducts = {
  userProducts: [],
};

const sortById = (a: Product, b: Product): number => a.id - b.id;

export const _userProductsReducer = createReducer(
  initialState,
  on(UserProductsAction.INTERNAL_ERROR, (state) => cloneDeep(state)),
  // GET USER PRODUCTS BY DATE
  on(UserProductsAction.GET_USER_PRODUCTS_BY_DATE_REQUEST, (state) =>
    cloneDeep(state)
  ),
  on(
    UserProductsAction.GET_USER_PRODUCTS_BY_DATE_REQUEST_SUCCESS,
    (state, action) => ({
      userProducts: cloneDeep(action.userProducts).sort(sortById),
    })
  ),
  on(UserProductsAction.GET_USER_PRODUCTS_BY_DATE_REQUEST_ERROR, (state) =>
    cloneDeep(state)
  ),
  // GET USER PRODUCTS BY DATE RANGE
  on(UserProductsAction.GET_USER_PRODUCTS_BY_DATE_RANGE_REQUEST, (state) =>
    cloneDeep(state)
  ),
  on(
    UserProductsAction.GET_USER_PRODUCTS_BY_DATE_RANGE_REQUEST_SUCCESS,
    (state, action) => ({
      userProducts: cloneDeep(action.userProducts).sort(sortById),
    })
  ),
  on(
    UserProductsAction.GET_USER_PRODUCTS_BY_DATE_RANGE_REQUEST_ERROR,
    (state) => cloneDeep(state)
  ),
  // ADD REDUCERS
  on(UserProductsAction.ADD_USER_PRODUCT_REQUEST, (state) => cloneDeep(state)),
  on(UserProductsAction.ADD_USER_PRODUCT_REQUEST_SUCCESS, (state, action) => ({
    userProducts: [
      ...cloneDeep(state.userProducts),
      cloneDeep(action.userProduct),
    ].sort(sortById),
  })),
  on(UserProductsAction.ADD_USER_PRODUCT_REQUEST_ERROR, (state) =>
    cloneDeep(state)
  ),
  // UPDATE REDUCERS
  on(UserProductsAction.UPDATE_USER_PRODUCT_REQUEST, (state) =>
    cloneDeep(state)
  ),
  on(
    UserProductsAction.UPDATE_USER_PRODUCT_REQUEST_SUCCESS,
    (state, action) => ({
      userProducts: [
        ...cloneDeep(
          state.userProducts.filter((p) => p.id !== action.userProduct.id)
        ),
        cloneDeep(action.userProduct),
      ].sort(sortById),
    })
  ),
  on(UserProductsAction.UPDATE_USER_PRODUCT_REQUEST_ERROR, (state) =>
    cloneDeep(state)
  ),
  // DELETE REDUCERS
  on(UserProductsAction.DELETE_USER_PRODUCT_REQUEST, (state) =>
    cloneDeep(state)
  ),
  on(
    UserProductsAction.DELETE_USER_PRODUCT_REQUEST_SUCCESS,
    (state, action) => ({
      userProducts: [
        ...cloneDeep(state.userProducts.filter((p) => p.id !== action.id)),
      ].sort(sortById),
    })
  ),
  on(UserProductsAction.DELETE_USER_PRODUCT_REQUEST_ERROR, (state) =>
    cloneDeep(state)
  )
);

export function userProductsReducer(state, action) {
  return _userProductsReducer(state, action);
}
