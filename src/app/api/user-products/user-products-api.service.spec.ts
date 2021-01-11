import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { Environment } from '@core/environment';
import { ErrorFormat } from '@core/models/error-format.model';
import { UserProduct } from '@core/models/user-products';
import {
  addUserProductDTO1,
  updateUserProduct1,
  userProduct1,
  userProduct2,
  userProductByDate,
  userProductByDateRange,
  userProductDeletion,
  userProductDTO1,
} from '@testsUT/user-products/user-products-mock-data.model';
import { UserProductsApiService } from './user-products-api.service';

describe('UserProductsApiService', () => {
  const apiUrl = Environment.apiUrl;
  const userProductsUrl = apiUrl + Environment.userProductsUrl.USER_PRODUCT;
  const userProductsByDateUrl =
    apiUrl + Environment.userProductsUrl.FIND_USER_PRODUCT_BY_BATE;
  const userProductsByDateRangeUrl =
    apiUrl + Environment.userProductsUrl.FIND_USER_PRODUCT_BY_BATE_RANGE;

  let injector: TestBed;
  let service: UserProductsApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    httpTestingController = injector.inject(HttpTestingController);
    service = injector.inject(UserProductsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should find user products by date successfully', () => {
    let error: ErrorFormat;
    let userProducts: UserProduct[] = [];

    service.findUserProductsByDate(userProductByDate).subscribe(
      (up: UserProduct[]) => (userProducts = up),
      (e: ErrorFormat) => (error = e)
    );

    httpTestingController
      .expectOne(userProductsByDateUrl)
      .flush([userProduct1, userProduct2]);

    expect(error).toBeFalsy();
    expect(userProducts.length).toEqual(2);
  });

  it('should fail to find user products by date', () => {
    let error: ErrorFormat;
    let userProducts: UserProduct[] = [];

    service.findUserProductsByDate(userProductByDate).subscribe(
      (up: UserProduct[]) => (userProducts = up),
      (e: ErrorFormat) => (error = e)
    );

    httpTestingController
      .expectOne(userProductsByDateUrl)
      .error(new ErrorEvent('Error'));

    expect(error).toBeTruthy();
    expect(userProducts.length).toEqual(0);
  });

  // find products by date range

  it('should find user products by date range successfully', () => {
    let error: ErrorFormat;
    let userProducts: UserProduct[] = [];

    service.findUserProductsByDateRange(userProductByDateRange).subscribe(
      (up: UserProduct[]) => (userProducts = up),
      (e: ErrorFormat) => (error = e)
    );

    httpTestingController
      .expectOne(userProductsByDateRangeUrl)
      .flush([userProduct1, userProduct2]);

    expect(error).toBeFalsy();
    expect(userProducts.length).toEqual(2);
  });

  it('should fail to find user products by date range', () => {
    let error: ErrorFormat;
    let userProducts: UserProduct[] = [];

    service.findUserProductsByDateRange(userProductByDateRange).subscribe(
      (up: UserProduct[]) => (userProducts = up),
      (e: ErrorFormat) => (error = e)
    );

    httpTestingController
      .expectOne(userProductsByDateRangeUrl)
      .error(new ErrorEvent('Error'));

    expect(error).toBeTruthy();
    expect(userProducts.length).toEqual(0);
  });

  // add products by date range

  it('should add user product successfully', () => {
    let error: ErrorFormat;
    let userProduct: UserProduct;

    service.addUserProduct(addUserProductDTO1).subscribe(
      (up: UserProduct) => (userProduct = up),
      (e: ErrorFormat) => (error = e)
    );

    httpTestingController.expectOne(userProductsUrl).flush(userProduct1);

    expect(error).toBeFalsy();
    expect(userProduct.id).toEqual(userProductDTO1.id);
    expect(userProduct.product.id).toEqual(userProductDTO1.productId);
    expect(userProduct.amount).toEqual(userProductDTO1.amount);
  });

  it('should fail to add user product', () => {
    let error: ErrorFormat;
    let userProduct;

    service.addUserProduct(addUserProductDTO1).subscribe(
      (up: UserProduct) => (userProduct = up),
      (e: ErrorFormat) => (error = e)
    );

    httpTestingController
      .expectOne(userProductsUrl)
      .error(new ErrorEvent('Error'));

    expect(error).toBeTruthy();
    expect(userProduct).toBeFalsy();
  });

  // update products by date range

  it('should update user product successfully', () => {
    let error: ErrorFormat;
    let userProduct: UserProduct;

    service.updateUserProduct(updateUserProduct1).subscribe(
      (up: UserProduct) => (userProduct = up),
      (e: ErrorFormat) => (error = e)
    );

    httpTestingController.expectOne(userProductsUrl).flush(userProduct1);

    expect(error).toBeFalsy();
    expect(userProduct.id).toEqual(userProductDTO1.id);
    expect(userProduct.product.id).toEqual(userProductDTO1.productId);
    expect(userProduct.amount).toEqual(userProductDTO1.amount);
  });

  it('should fail to update user product', () => {
    let error: ErrorFormat;
    let userProduct;

    service.updateUserProduct(updateUserProduct1).subscribe(
      (up: UserProduct) => (userProduct = up),
      (e: ErrorFormat) => (error = e)
    );

    httpTestingController
      .expectOne(userProductsUrl)
      .error(new ErrorEvent('Error'));

    expect(error).toBeTruthy();
    expect(userProduct).toBeFalsy();
  });

  // update products by date range

  it('should delete user product successfully', () => {
    let error: ErrorFormat;

    service.deleteUserProduct(userProductDeletion).subscribe(
      () => {},
      (e: ErrorFormat) => (error = e)
    );

    httpTestingController.expectOne(userProductsUrl).flush({});

    expect(error).toBeFalsy();
  });

  it('should fail to delete user product', () => {
    let error: ErrorFormat;

    service.deleteUserProduct(userProductDeletion).subscribe(
      () => {},
      (e: ErrorFormat) => (error = e)
    );

    httpTestingController
      .expectOne(userProductsUrl)
      .error(new ErrorEvent('Error'));

    expect(error).toBeTruthy();
  });
});
