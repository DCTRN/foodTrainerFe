import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from '@core/environment';
import {
  UserProductDTO,
  UserProductDeletion,
  UserProductModification,
  UserProductsByDate,
  UserProductsByDateRange,
  UserProduct,
} from '@core/models/user-products';
import { propagateError } from '@core/rxjs-operators/propagate-error';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserProductsApiService {
  private readonly apiUrl = Environment.apiUrl;
  private readonly userProductsUrl =
    this.apiUrl + Environment.userProductsUrl.USER_PRODUCT;
  private readonly productsByDateUrl =
    this.apiUrl + Environment.userProductsUrl.FIND_USER_PRODUCT_BY_BATE;
  private readonly productsByDateRangeUrl =
    this.apiUrl + Environment.userProductsUrl.FIND_USER_PRODUCT_BY_BATE_RANGE;

  constructor(private httpClient: HttpClient) {}

  public findUserProductsByDate(
    date: UserProductsByDate
  ): Observable<UserProduct[]> {
    return this.httpClient
      .post<UserProduct[]>(this.productsByDateUrl, date)
      .pipe(propagateError());
  }

  public findUserProductsByDateRange(
    date: UserProductsByDateRange
  ): Observable<UserProduct[]> {
    return this.httpClient
      .post<UserProduct[]>(this.productsByDateRangeUrl, date)
      .pipe(propagateError());
  }

  public addUserProduct(userProduct: UserProductDTO): Observable<UserProduct> {
    return this.httpClient
      .post<UserProduct>(this.userProductsUrl, userProduct)
      .pipe(propagateError());
  }

  public updateUserProduct(
    userProduct: UserProductModification
  ): Observable<UserProduct> {
    return this.httpClient
      .patch<UserProduct>(this.userProductsUrl, userProduct)
      .pipe(propagateError());
  }

  public deleteUserProduct(
    userProduct: UserProductDeletion
  ): Observable<Object> {
    return this.httpClient
      .request('DELETE', this.userProductsUrl, {
        body: userProduct,
      })
      .pipe(propagateError());
  }
}
