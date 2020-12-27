import { createAction, props } from '@ngrx/store';
import { Product } from '../../models/products';

export type Products = {
  products: Array<Product>;
};

export const internalErrorType = '[PRODUCTS] INTERNAL_ERROR';
// GET PRODUCTS BY USER ID TYPES
export const getAllProductsByUserIdType = '[PRODUCTS] GET_ALL_PRODUCTS_REQUEST';
export const getAllProductsByUserIdSuccessType =
  '[PRODUCTS] GET_ALL_PRODUCTS_REQUEST_SUCCESS';
export const getAllProductsByUserIdErrorType =
  '[PRODUCTS] GET_ALL_PRODUCTS_REQUEST_ERROR';

// ADD PRODUCTS TYPES
export const addProductType = '[PRODUCTS] ADD_PRODUCT_REQUEST';
export const addProductSuccessType = '[PRODUCTS] ADD_PRODUCT_REQUEST_SUCCESS';
export const addProductErrorType = '[PRODUCTS] ADD_PRODUCT_REQUEST_ERROR';

// UPDATE PRODUCTS TYPES
export const updateProductType = '[PRODUCTS] UPDATE_PRODUCT_REQUEST';
export const updateProductSuccessType =
  '[PRODUCTS] UPDATE_PRODUCT_REQUEST_SUCCESS';
export const updateProductErrorType = '[PRODUCTS] UPDATE_PRODUCT_REQUEST_ERROR';

// DELETE PRODUCTS TYPES
export const deleteProductType = '[PRODUCTS] DELETE_PRODUCT_REQUEST';
export const deleteProductSuccessType =
  '[PRODUCTS] DELETE_PRODUCT_REQUEST_SUCCESS';
export const deleteProductErrorType = '[PRODUCTS] DELETE_PRODUCT_REQUEST_ERROR';

// GET PRODUCTS BY USER ID ACTIONS
export const getAllProductsByUserId = createAction(getAllProductsByUserIdType);
export const getAllProductsByUserIdSuccess = createAction(
  getAllProductsByUserIdSuccessType,
  props<Products>()
);
export const getAllProductsByUserIdError = createAction(
  getAllProductsByUserIdErrorType
);

export const internalError = createAction(internalErrorType);

// ADD PRODUCTS ACTIONS
export const addProduct = createAction(
  addProductType,
  props<{ product: Product }>()
);
export const addProductSuccess = createAction(
  addProductSuccessType,
  props<{ product: Product }>()
);
export const addProductError = createAction(addProductErrorType);

// UPDATE PRODUCTS ACTIONS
export const updateProduct = createAction(
  updateProductType,
  props<{ product: Product }>()
);
export const updateProductSuccess = createAction(
  updateProductSuccessType,
  props<{ product: Product }>()
);
export const updateProductError = createAction(updateProductErrorType);

// DELETE PRODUCTS ACTIONS
export const deleteProduct = createAction(
  deleteProductType,
  props<{ id: number }>()
);
export const deleteProductSuccess = createAction(
  deleteProductSuccessType,
  props<{ id: number }>()
);
export const deleteProductError = createAction(deleteProductErrorType);

export const ProductsActionType = {
  INTERNAL_ERROR: internalErrorType,
  // GET PRODUCTS BY USER ID TYPES
  GET_ALL_PRODUCTS_REQUEST: getAllProductsByUserIdType,
  GET_ALL_PRODUCTS_REQUEST_SUCCESS: getAllProductsByUserIdSuccessType,
  GET_ALL_PRODUCTS_REQUEST_ERROR: getAllProductsByUserIdErrorType,
  // ADD PRODUCTS TYPES
  ADD_PRODUCT_REQUEST: addProductType,
  ADD_PRODUCT_REQUEST_SUCCESS: addProductSuccessType,
  ADD_PRODUCT_REQUEST_ERROR: addProductErrorType,
  // UPDATE PRODUCTS TYPES
  UPDATE_PRODUCT_REQUEST: updateProductType,
  UPDATE_PRODUCT_REQUEST_SUCCESS: updateProductSuccessType,
  UPDATE_PRODUCT_REQUEST_ERROR: updateProductErrorType,
  // DELETE PRODUCTS TYPES
  DELETE_PRODUCT_REQUEST: deleteProductType,
  DELETE_PRODUCT_REQUEST_SUCCESS: deleteProductSuccessType,
  DELETE_PRODUCT_REQUEST_ERROR: deleteProductErrorType,
};

export const ProductsAction = {
  INTERNAL_ERROR: internalError,
  // GET PRODUCTS BY USER ID ACTIONS
  GET_ALL_PRODUCTS_REQUEST: getAllProductsByUserId,
  GET_ALL_PRODUCTS_REQUEST_SUCCESS: getAllProductsByUserIdSuccess,
  GET_ALL_PRODUCTS_REQUEST_ERROR: getAllProductsByUserIdError,
  // ADD PRODUCTS ACTIONS
  ADD_PRODUCT_REQUEST: addProduct,
  ADD_PRODUCT_REQUEST_SUCCESS: addProductSuccess,
  ADD_PRODUCT_REQUEST_ERROR: addProductError,
  // UPDATE PRODUCTS ACTIONS
  UPDATE_PRODUCT_REQUEST: updateProduct,
  UPDATE_PRODUCT_REQUEST_SUCCESS: updateProductSuccess,
  UPDATE_PRODUCT_REQUEST_ERROR: updateProductError,
  // DELETE PRODUCTS ACTIONS
  DELETE_PRODUCT_REQUEST: deleteProduct,
  DELETE_PRODUCT_REQUEST_SUCCESS: deleteProductSuccess,
  DELETE_PRODUCT_REQUEST_ERROR: deleteProductError,
};
