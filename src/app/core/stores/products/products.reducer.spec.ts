import { Products, ProductsAction } from './products.actions';
import { productsReducer } from './products.reducer';
import { isEqual } from 'lodash';
import {
  addProduct1,
  product1,
  product2,
} from '@testsUT/products/products-mock-data.model';
import { Product } from '@core/models/products';

const getAllProductsRequestSuccessMock: Product[] = [product1, product2];

const initialState: Products = {
  products: [],
};

describe('Products Reducer', () => {
  it('should  get all products', () => {
    let result = productsReducer(
      initialState,
      ProductsAction.GET_ALL_PRODUCTS_REQUEST()
    );
    expect(result).toEqual(initialState);

    result = productsReducer(
      result,
      ProductsAction.GET_ALL_PRODUCTS_REQUEST_SUCCESS({
        products: getAllProductsRequestSuccessMock,
      })
    );
    expect(isEqual(result.products, getAllProductsRequestSuccessMock)).toEqual(
      true
    );

    result = productsReducer(
      result,
      ProductsAction.GET_ALL_PRODUCTS_REQUEST_ERROR()
    );
    expect(isEqual(result.products, getAllProductsRequestSuccessMock)).toEqual(
      true
    );
  });

  it('should add product', () => {
    let result = productsReducer(
      initialState,
      ProductsAction.ADD_PRODUCT_REQUEST({ product: addProduct1 })
    );
    expect(result).toEqual(initialState);

    result = productsReducer(
      result,
      ProductsAction.ADD_PRODUCT_REQUEST_SUCCESS({ product: product1 })
    );
    expect(isEqual(result.products[0], product1)).toEqual(true);

    result = productsReducer(
      result,
      ProductsAction.GET_ALL_PRODUCTS_REQUEST_ERROR()
    );
    expect(isEqual(result.products[0], product1)).toEqual(true);
  });

  it('should update product', () => {
    let result = productsReducer(
      initialState,
      ProductsAction.UPDATE_PRODUCT_REQUEST({ product: addProduct1 })
    );
    expect(result).toEqual(initialState);

    result = productsReducer(
      result,
      ProductsAction.UPDATE_PRODUCT_REQUEST_SUCCESS({ product: product1 })
    );
    expect(isEqual(result.products[0], product1)).toEqual(true);

    result = productsReducer(
      result,
      ProductsAction.UPDATE_PRODUCT_REQUEST_ERROR()
    );
    expect(isEqual(result.products[0], product1)).toEqual(true);
  });

  it('should delete product', () => {
    let result = productsReducer(
      {
        products: [product1],
      },
      ProductsAction.DELETE_PRODUCT_REQUEST({
        id: 1,
      })
    );
    expect(result.products.length).toEqual(1);

    result = productsReducer(
      result,
      ProductsAction.DELETE_PRODUCT_REQUEST_SUCCESS({ id: 1 })
    );
    expect(result.products.length).toEqual(0);

    result = productsReducer(
      result,
      ProductsAction.DELETE_PRODUCT_REQUEST_ERROR()
    );
    expect(result.products.length).toEqual(0);
  });

  it('should does not change state on internal error', () => {
    let result = productsReducer(
      {
        products: [product1],
      },
      ProductsAction.INTERNAL_ERROR()
    );
    expect(result.products.length).toEqual(1);
  });
});
