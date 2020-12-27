import {
  Product,
  ProductDeletion,
  ProductModification,
} from '@core/models/products';
import { Observable, of } from 'rxjs';

export class ProductsApiServiceMock {
  public findProductsByUserId(id: number): Observable<Product[]> {
    return of(null);
  }

  public findProductsBy(searchText: string): Observable<Product[]> {
    return of(null);
  }

  public addProduct(product: Product): Observable<Product> {
    return of(null);
  }

  public updateProduct(product: ProductModification): Observable<Product> {
    return of(null);
  }

  public deleteProduct(product: ProductDeletion): Observable<Object> {
    return of(null);
  }
}
