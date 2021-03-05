import { Injectable } from '@angular/core';
import { ProductsApiService } from '@api/products/products-api.service';
import { Product } from '@core/models/products';
import { NotificationService } from '@core/notifications/service/notification.service';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class MealsSearchListService {
  constructor(
    private productsApiService: ProductsApiService,
    private notificationService: NotificationService
  ) {}

  public findProductsBy(searchText: string): Observable<Product[]> {
    return this.productsApiService.findProductsBy(searchText).pipe(
      tap((products: Product[]) => this.successHandler(products)),
      catchError(() => this.errorHandler())
    );
  }

  private errorHandler(): Observable<Product[]> {
    this.notificationService.error(
      'Failed to find products due to internal error'
    );
    return of([]);
  }

  private successHandler(products: Product[]): void {
    return this.notificationService.success(
      `Found ${products.length} products`
    );
  }
}
