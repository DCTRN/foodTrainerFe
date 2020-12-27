import { createReducer, on } from '@ngrx/store';
import { Products, ProductsAction } from './products.actions';

export const initialState: Products = {
  products: [],
};

export const _productsReducer = createReducer(
  initialState,
  on(ProductsAction.INTERNAL_ERROR, (state) => state),
  // GET ALL REDUCERS
  on(ProductsAction.GET_ALL_PRODUCTS_REQUEST, (state) => state),
  on(ProductsAction.GET_ALL_PRODUCTS_REQUEST_SUCCESS, (state, action) => ({
    products: action.products,
  })),
  on(ProductsAction.GET_ALL_PRODUCTS_REQUEST_ERROR, (state) => state),
  // ADD REDUCERS
  on(ProductsAction.ADD_PRODUCT_REQUEST, (state) => state),
  on(ProductsAction.ADD_PRODUCT_REQUEST_SUCCESS, (state, action) => ({
    products: [...state.products, action.product],
  })),
  on(ProductsAction.ADD_PRODUCT_REQUEST_ERROR, (state) => state),
  // UPDATE REDUCERS
  on(ProductsAction.UPDATE_PRODUCT_REQUEST, (state) => state),
  on(ProductsAction.UPDATE_PRODUCT_REQUEST_SUCCESS, (state, action) => ({
    products: [
      ...state.products.filter((p) => p.id !== action.product.id),
      action.product,
    ],
  })),
  on(ProductsAction.UPDATE_PRODUCT_REQUEST_ERROR, (state) => state),
  // DELETE REDUCERS
  on(ProductsAction.DELETE_PRODUCT_REQUEST, (state) => state),
  on(ProductsAction.DELETE_PRODUCT_REQUEST_SUCCESS, (state, action) => ({
    products: [...state.products.filter((p) => p.id !== action.id)],
  })),
  on(ProductsAction.DELETE_PRODUCT_REQUEST_ERROR, (state) => state)
);

export function productsReducer(state, action) {
  return _productsReducer(state, action);
}
