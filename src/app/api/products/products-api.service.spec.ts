import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { Environment } from '@core/environment';
import { ErrorFormat } from '@core/models/error-format.model';
import { Product } from '@core/models/products';
import {
  addProduct1,
  product1,
  productDeletion1,
  productModification1,
  productsMock,
  updateProduct1,
} from '@testsUT/products/products-mock-data.model';
import { ProductsApiService } from './products-api.service';

describe('ProductsApiService', () => {
  const apiUrl = Environment.apiUrl;
  const productsUrl = apiUrl + Environment.productsUrl.PRODUCT;
  const searchTextQuery = 'searchText';
  const userIdQuery = 'userId';

  let injector: TestBed;
  let service: ProductsApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    httpTestingController = injector.inject(HttpTestingController);
    service = injector.inject(ProductsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should find products by userId successfully', () => {
    const userId = 1;
    const userIdUrl = `${productsUrl}?${userIdQuery}=${userId}`;
    let products: Product[] = [];
    let error: ErrorFormat;

    service.findProductsByUserId(1).subscribe(
      (p) => (products = p),
      (e) => (error = e)
    );

    httpTestingController.expectOne(userIdUrl).flush(productsMock);

    expect(products.length).toEqual(productsMock.length);
    expect(error).toBeFalsy();
  });

  it('should fail to find products by userId', () => {
    const userId = 1;
    const userIdUrl = `${productsUrl}?${userIdQuery}=${userId}`;
    let products: Product[] = [];
    let error: ErrorFormat;

    service.findProductsByUserId(1).subscribe(
      (p) => (products = p),
      (e) => (error = e)
    );

    httpTestingController.expectOne(userIdUrl).error(new ErrorEvent('Error'));

    expect(products.length).toEqual(0);
    expect(error).toBeTruthy();
  });

  // find by searchText

  it('should find products by searchText successfully', () => {
    const searchText = 'lidl';
    const userIdUrl = `${productsUrl}?${searchTextQuery}=${searchText}`;
    let products: Product[] = [];
    let error: ErrorFormat;

    service.findProductsBy(searchText).subscribe(
      (p) => (products = p),
      (e) => (error = e)
    );

    httpTestingController.expectOne(userIdUrl).flush(productsMock);

    expect(products.length).toEqual(productsMock.length);
    expect(error).toBeFalsy();
  });

  it('should fail to find products by userId', () => {
    const searchText = 'lidl';
    const userIdUrl = `${productsUrl}?${searchTextQuery}=${searchText}`;
    let products: Product[] = [];
    let error: ErrorFormat;

    service.findProductsBy(searchText).subscribe(
      (p) => (products = p),
      (e) => (error = e)
    );

    httpTestingController.expectOne(userIdUrl).error(new ErrorEvent('Error'));

    expect(products.length).toEqual(0);
    expect(error).toBeTruthy();
  });

  // add product

  it('should add product successfully', () => {
    let product: Product;
    let error: ErrorFormat;

    service.addProduct(addProduct1).subscribe(
      (p) => (product = p),
      (e) => (error = e)
    );

    httpTestingController.expectOne(productsUrl).flush(product1);

    expect(product.name).toEqual(product1.name);
    expect(product.producer).toEqual(product1.producer);
    expect(error).toBeFalsy();
  });

  it('should fail to add product', () => {
    let product: Product;
    let error: ErrorFormat;

    service.addProduct(addProduct1).subscribe(
      (p) => (product = p),
      (e) => (error = e)
    );

    httpTestingController.expectOne(productsUrl).error(new ErrorEvent('Error'));

    expect(product).toBeFalsy();
    expect(error).toBeTruthy();
  });

  // update product

  it('should update product successfully', () => {
    let product: Product;
    let error: ErrorFormat;

    service.updateProduct(productModification1).subscribe(
      (p) => (product = p),
      (e) => (error = e)
    );

    httpTestingController.expectOne(productsUrl).flush(updateProduct1);

    expect(product.name).toEqual(updateProduct1.name);
    expect(product.producer).toEqual(updateProduct1.producer);
    expect(product.kcal).toEqual(updateProduct1.kcal);
    expect(error).toBeFalsy();
  });

  it('should fail to update product', () => {
    let product: Product;
    let error: ErrorFormat;

    service.updateProduct(productModification1).subscribe(
      (p) => (product = p),
      (e) => (error = e)
    );

    httpTestingController.expectOne(productsUrl).error(new ErrorEvent('Error'));

    expect(product).toBeFalsy();
    expect(error).toBeTruthy();
  });

  // delete product

  it('should delete product successfully', () => {
    let error: ErrorFormat;

    service.deleteProduct(productDeletion1).subscribe(
      () => {},
      (e) => (error = e)
    );

    httpTestingController.expectOne(productsUrl).flush({});

    expect(error).toBeFalsy();
  });

  it('should delete to update product', () => {
    let error: ErrorFormat;

    service.deleteProduct(productDeletion1).subscribe(
      () => {},
      (e) => (error = e)
    );

    httpTestingController.expectOne(productsUrl).error(new ErrorEvent('Error'));

    expect(error).toBeTruthy();
  });
});
