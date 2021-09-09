// import { UserProduct } from '@core/models/user-products';
// import {
//   updateUserProduct1,
//   userProduct1,
//   userProduct2,
//   userProduct3,
//   userProductByDate,
//   userProductByDateRange,
//   userProductDTO1,
// } from '@testsUT/user-products/user-products-mock-data.model';
// import { UserProducts, UserProductsAction } from './report-tab.actions';
// import { userProductsReducer } from './report-tab.reducer';

// const getUserProductsByDateSuccessMock: UserProduct[] = [
//   userProduct1,
//   userProduct2,
//   userProduct3,
// ];

// const initialState: UserProducts = {
//   userProducts: [],
// };

// // TODO assign test types to new types utilities
// describe('User products Reducer', () => {
//   it('should  get user products by date', () => {
//     let result = userProductsReducer(
//       initialState,
//       UserProductsAction.GET_USER_PRODUCTS_BY_DATE_REQUEST({
//         userProductsBy: userProductByDate,
//       })
//     );
//     expect(result).toEqual(initialState);

//     result = userProductsReducer(
//       result,
//       UserProductsAction.GET_USER_PRODUCTS_BY_DATE_REQUEST_SUCCESS({
//         userProducts: getUserProductsByDateSuccessMock,
//       })
//     );

//     expect(result.userProducts).toEqual(getUserProductsByDateSuccessMock);

//     result = userProductsReducer(
//       result,
//       UserProductsAction.GET_USER_PRODUCTS_BY_DATE_REQUEST_ERROR()
//     );

//     expect(result.userProducts).toEqual(getUserProductsByDateSuccessMock);
//   });

//   it('should  get user products by date range', () => {
//     let result = userProductsReducer(
//       initialState,
//       UserProductsAction.GET_USER_PRODUCTS_BY_DATE_RANGE_REQUEST({
//         userProductsBy: userProductByDateRange,
//       })
//     );
//     expect(result).toEqual(initialState);

//     result = userProductsReducer(
//       result,
//       UserProductsAction.GET_USER_PRODUCTS_BY_DATE_RANGE_REQUEST_SUCCESS({
//         userProducts: getUserProductsByDateSuccessMock,
//       })
//     );

//     expect(result.userProducts).toEqual(getUserProductsByDateSuccessMock);

//     result = userProductsReducer(
//       result,
//       UserProductsAction.GET_USER_PRODUCTS_BY_DATE_RANGE_REQUEST_ERROR()
//     );

//     expect(result.userProducts).toEqual(getUserProductsByDateSuccessMock);
//   });

//   it('should add user product', () => {
//     let result = userProductsReducer(
//       initialState,
//       UserProductsAction.ADD_USER_PRODUCT_REQUEST({
//         userProduct: userProductDTO1,
//       })
//     );
//     expect(result).toEqual(initialState);

//     result = userProductsReducer(
//       result,
//       UserProductsAction.ADD_USER_PRODUCT_REQUEST_SUCCESS({
//         userProduct: userProduct1,
//       })
//     );

//     expect(result.userProducts).toEqual([userProduct1]);

//     result = userProductsReducer(
//       result,
//       UserProductsAction.ADD_USER_PRODUCT_REQUEST_ERROR()
//     );

//     expect(result.userProducts).toEqual([userProduct1]);
//   });

//   it('should update user product', () => {
//     let result = userProductsReducer(
//       initialState,
//       UserProductsAction.UPDATE_USER_PRODUCT_REQUEST({
//         userProductModification: updateUserProduct1,
//       })
//     );
//     expect(result).toEqual(initialState);

//     result = userProductsReducer(
//       result,
//       UserProductsAction.UPDATE_USER_PRODUCT_REQUEST_SUCCESS({
//         userProduct: userProduct1,
//       })
//     );

//     expect(result.userProducts).toEqual([userProduct1]);

//     result = userProductsReducer(
//       result,
//       UserProductsAction.UPDATE_USER_PRODUCT_REQUEST_ERROR()
//     );

//     expect(result.userProducts).toEqual([userProduct1]);
//   });

//   it('should delete user product', () => {
//     let result = userProductsReducer(
//       initialState,
//       UserProductsAction.ADD_USER_PRODUCT_REQUEST_SUCCESS({
//         userProduct: userProduct1,
//       })
//     );
//     expect(result.userProducts).toEqual([userProduct1]);

//     result = userProductsReducer(
//       result,
//       UserProductsAction.DELETE_USER_PRODUCT_REQUEST_ERROR()
//     );
//     expect(result.userProducts).toEqual([userProduct1]);

//     result = userProductsReducer(
//       result,
//       UserProductsAction.DELETE_USER_PRODUCT_REQUEST_SUCCESS({
//         id: userProductDTO1.id,
//       })
//     );
//     expect(result.userProducts).toEqual([]);
//   });
// });
