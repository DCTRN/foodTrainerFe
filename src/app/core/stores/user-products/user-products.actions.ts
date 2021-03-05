import {
  UserProductDTO,
  UserProductDeletion,
  UserProductModification,
  UserProductsByDate,
  UserProductsByDateRange,
  UserProduct,
} from '@core/models/user-products';
import { createAction, props } from '@ngrx/store';

export type UserProducts = {
  userProducts: Array<UserProduct>;
};

export const internalErrorType = '[USER_PRODUCTS] INTERNAL_ERROR';
export const internalError = createAction(internalErrorType);

// GET USER PRODUCTS BY DATE TYPE
export const getUserProductsByDateType =
  '[USER_PRODUCTS] GET_USER_PRODUCTS_BY_DATE_REQUEST';
export const getUserProductsByDateSuccessType =
  '[USER_PRODUCTS] GET_USER_PRODUCTS_BY_DATE_REQUEST_SUCCESS';
export const getUserProductsByDateErrorType =
  '[USER_PRODUCTS] GET_USER_PRODUCTS_BY_DATE_REQUEST_ERROR';

// GET USER PRODUCTS BY DATE ACTIONS
export const getUserProductsByDate = createAction(
  getUserProductsByDateType,
  props<{ userProductsBy: Pick<UserProductsByDate, 'date'> }>()
);
export const getUserProductsByDateSuccess = createAction(
  getUserProductsByDateSuccessType,
  props<UserProducts>()
);
export const getUserProductsByDateError = createAction(
  getUserProductsByDateErrorType
);

// GET USER PRODUCTS BY DATE RANGE TYPE
export const getUserProductsByDateRangeType =
  '[USER_PRODUCTS] GET_USER_PRODUCTS_BY_DATE_RANGE_REQUEST';
export const getUserProductsByDateRangeSuccessType =
  '[USER_PRODUCTS] GET_USER_PRODUCTS_BY_DATE_REQUEST_RANGE_SUCCESS';
export const getUserProductsByDateRangeErrorType =
  '[USER_PRODUCTS] GET_USER_PRODUCTS_BY_DATE_REQUEST_RANGE_ERROR';

// GET USER PRODUCTS BY DATE RANGE ACTIONS
export const getUserProductsByDateRange = createAction(
  getUserProductsByDateRangeType,
  props<{ userProductsBy: Omit<UserProductsByDateRange, 'userId'> }>()
);
export const getUserProductsByDateRangeSuccess = createAction(
  getUserProductsByDateRangeSuccessType,
  props<UserProducts>()
);
export const getUserProductsByDateRangeError = createAction(
  getUserProductsByDateRangeErrorType
);

// ADD USER PRODUCT TYPE
export const addUserProductType = '[USER_PRODUCTS] ADD_USER_PRODUCT_REQUEST';
export const addUserProductSuccessType =
  '[USER_PRODUCTS] ADD_USER_PRODUCT_REQUEST_SUCCESS';
export const addUserProductErrorType =
  '[USER_PRODUCTS] ADD_USER_PRODUCT_REQUEST_ERROR';

// ADD USER PRODUCT ACTIONS
export const addUserProduct = createAction(
  addUserProductType,
  props<{ userProduct: Omit<UserProductDTO, 'userId'> }>()
);
export const addUserProductSuccess = createAction(
  addUserProductSuccessType,
  props<{ userProduct: UserProduct }>()
);
export const addUserProductError = createAction(addUserProductErrorType);

// UPDATE USER PRODUCT TYPE
export const updateUserProductType =
  '[USER_PRODUCTS] UPDATE_USER_PRODUCT_REQUEST';
export const updateUserProductSuccessType =
  '[USER_PRODUCTS] UPDATE_USER_PRODUCT_REQUEST_SUCCESS';
export const updateUserProductErrorType =
  '[USER_PRODUCTS] UPDATE_USER_PRODUCT_REQUEST_ERROR';

// ADD USER PRODUCT ACTIONS
export const updateUserProduct = createAction(
  updateUserProductType,
  props<{ userProductModification: Omit<UserProductModification, 'userId'> }>()
);
export const updateUserProductSuccess = createAction(
  updateUserProductSuccessType,
  props<{ userProduct: UserProduct }>()
);
export const updateUserProductError = createAction(updateUserProductErrorType);

// DELETE USER PRODUCT TYPE
export const deleteUserProductType =
  '[USER_PRODUCTS] DELETE_USER_PRODUCT_REQUEST';
export const deleteUserProductSuccessType =
  '[USER_PRODUCTS] DELETE_USER_PRODUCT_REQUEST_SUCCESS';
export const deleteUserProductErrorType =
  '[USER_PRODUCTS] DELETE_USER_PRODUCT_REQUEST_ERROR';

// DELETE USER PRODUCT ACTIONS
export const deleteUserProduct = createAction(
  deleteUserProductType,
  props<{ userProductDeletion: Omit<UserProductDeletion, 'userId'> }>()
);
export const deleteUserProductSuccess = createAction(
  deleteUserProductSuccessType,
  props<{ id: number }>()
);
export const deleteUserProductError = createAction(deleteUserProductErrorType);

export const UserProductsActionType = {
  INTERNAL_ERROR: internalErrorType,
  // GET USER PRODUCTS BY DATE TYPE
  GET_USER_PRODUCTS_BY_DATE_REQUEST: getUserProductsByDateType,
  GET_USER_PRODUCTS_BY_DATE_REQUEST_SUCCESS: getUserProductsByDateType,
  GET_USER_PRODUCTS_BY_DATE_REQUEST_ERROR: getUserProductsByDateErrorType,
  // GET USER PRODUCTS BY DATE RANGE TYPE
  GET_USER_PRODUCTS_BY_DATE_RANGE_REQUEST: getUserProductsByDateRangeType,
  GET_USER_PRODUCTS_BY_DATE_RANGE_REQUEST_SUCCESS: getUserProductsByDateRangeSuccessType,
  GET_USER_PRODUCTS_BY_DATE_RANGE_REQUEST_ERROR: getUserProductsByDateRangeErrorType,
  // ADD USER PRODUCT TYPE
  ADD_USER_PRODUCT_REQUEST: addUserProductType,
  ADD_USER_PRODUCT_REQUEST_SUCCESS: addUserProductSuccessType,
  ADD_USER_PRODUCT_REQUEST_ERROR: addUserProductErrorType,
  // UPDATE USER PRODUCT TYPE
  UPDATE_USER_PRODUCT_REQUEST: updateUserProductType,
  UPDATE_USER_PRODUCT_REQUEST_SUCCESS: updateUserProductSuccessType,
  UPDATE_USER_PRODUCT_REQUEST_ERROR: updateUserProductErrorType,
  // DELETE USER PRODUCT TYPE
  DELETE_USER_PRODUCT_REQUEST: deleteUserProductType,
  DELETE_USER_PRODUCT_REQUEST_SUCCESS: deleteUserProductSuccessType,
  DELETE_USER_PRODUCT_REQUEST_ERROR: deleteUserProductErrorType,
};

export const UserProductsAction = {
  INTERNAL_ERROR: internalError,
  // GET USER PRODUCTS BY DATE ACTIONS
  GET_USER_PRODUCTS_BY_DATE_REQUEST: getUserProductsByDate,
  GET_USER_PRODUCTS_BY_DATE_REQUEST_SUCCESS: getUserProductsByDateSuccess,
  GET_USER_PRODUCTS_BY_DATE_REQUEST_ERROR: getUserProductsByDateError,
  // GET USER PRODUCTS BY DATE RANGE TYPE
  GET_USER_PRODUCTS_BY_DATE_RANGE_REQUEST: getUserProductsByDateRange,
  GET_USER_PRODUCTS_BY_DATE_RANGE_REQUEST_SUCCESS: getUserProductsByDateRangeSuccess,
  GET_USER_PRODUCTS_BY_DATE_RANGE_REQUEST_ERROR: getUserProductsByDateRangeError,
  // ADD USER PRODUCT TYPE
  ADD_USER_PRODUCT_REQUEST: addUserProduct,
  ADD_USER_PRODUCT_REQUEST_SUCCESS: addUserProductSuccess,
  ADD_USER_PRODUCT_REQUEST_ERROR: addUserProductError,
  // UPDATE USER PRODUCT TYPE
  UPDATE_USER_PRODUCT_REQUEST: updateUserProduct,
  UPDATE_USER_PRODUCT_REQUEST_SUCCESS: updateUserProductSuccess,
  UPDATE_USER_PRODUCT_REQUEST_ERROR: updateUserProductError,
  // DELETE USER PRODUCT TYPE
  DELETE_USER_PRODUCT_REQUEST: deleteUserProduct,
  DELETE_USER_PRODUCT_REQUEST_SUCCESS: deleteUserProductSuccess,
  DELETE_USER_PRODUCT_REQUEST_ERROR: deleteUserProductError,
};
