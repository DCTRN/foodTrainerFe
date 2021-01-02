import { createReducer, on } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { Products, ProductsAction } from './products.actions';

export const initialState: Products = {
  products: [],
};

export const _productsReducer = createReducer(
  initialState,
  on(ProductsAction.INTERNAL_ERROR, (state) => cloneDeep(state)),
  // GET ALL REDUCERS
  on(ProductsAction.GET_ALL_PRODUCTS_REQUEST, (state) => cloneDeep(state)),
  on(ProductsAction.GET_ALL_PRODUCTS_REQUEST_SUCCESS, (state, action) => ({
    products: cloneDeep(action.products),
  })),
  on(ProductsAction.GET_ALL_PRODUCTS_REQUEST_ERROR, (state) =>
    cloneDeep(state)
  ),
  // ADD REDUCERS
  on(ProductsAction.ADD_PRODUCT_REQUEST, (state) => cloneDeep(state)),
  on(ProductsAction.ADD_PRODUCT_REQUEST_SUCCESS, (state, action) => ({
    products: [...cloneDeep(state.products), cloneDeep(action.product)],
  })),
  on(ProductsAction.ADD_PRODUCT_REQUEST_ERROR, (state) => cloneDeep(state)),
  // UPDATE REDUCERS
  on(ProductsAction.UPDATE_PRODUCT_REQUEST, (state) => cloneDeep(state)),
  on(ProductsAction.UPDATE_PRODUCT_REQUEST_SUCCESS, (state, action) => ({
    products: [
      ...cloneDeep(state.products.filter((p) => p.id !== action.product.id)),
      cloneDeep(action.product),
    ],
  })),
  on(ProductsAction.UPDATE_PRODUCT_REQUEST_ERROR, (state) => cloneDeep(state)),
  // DELETE REDUCERS
  on(ProductsAction.DELETE_PRODUCT_REQUEST, (state) => cloneDeep(state)),
  on(ProductsAction.DELETE_PRODUCT_REQUEST_SUCCESS, (state, action) => ({
    products: [...cloneDeep(state.products.filter((p) => p.id !== action.id))],
  })),
  on(ProductsAction.DELETE_PRODUCT_REQUEST_ERROR, (state) => cloneDeep(state))
);

export function productsReducer(state, action) {
  return _productsReducer(state, action);
}
