import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from '@core/environment';
import {
  Product,
  ProductDeletion,
  ProductModification,
} from '@core/models/products';
import { propagateError } from '@core/rxjs-operators/propagate-error';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductsApiService {
  private readonly apiUrl = Environment.apiUrl;
  private readonly productsUrl = this.apiUrl + Environment.productsUrl.PRODUCT;

  constructor(private httpClient: HttpClient) {}

  public findProductsByUserId(id: number): Observable<Product[]> {
    const params = new HttpParams().append('userId', String(id));
    return this.httpClient
      .get<Product[]>(this.productsUrl, { params })
      .pipe(propagateError());
  }

  public findProductsBy(searchText: string): Observable<Product[]> {
    const params = new HttpParams().append('searchText', searchText);
    return this.httpClient
      .get<Product[]>(this.productsUrl, { params })
      .pipe(propagateError());
  }

  public addProduct(product: Product): Observable<Product> {
    return this.httpClient
      .post<Product>(this.productsUrl, product)
      .pipe(propagateError());
  }

  public updateProduct(product: ProductModification): Observable<Product> {
    return this.httpClient
      .patch<Product>(this.productsUrl, product)
      .pipe(propagateError());
  }

  public deleteProduct(product: ProductDeletion): Observable<Object> {
    return this.httpClient
      .request('DELETE', this.productsUrl, { body: product })
      .pipe(
        switchMap(() => of({})),
        propagateError()
      );
  }
}
