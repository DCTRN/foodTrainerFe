import { getTestBed, TestBed } from '@angular/core/testing';
import { ProductsApiService } from '@api/products/products-api.service';
import { Product } from '@core/models/products';
import { NotificationService } from '@core/notifications/service/notification.service';
import { product1, product2 } from '@testsUT/products/products-mock-data.model';
import { ProductsApiServiceMock } from '@testsUT/products/products-mock-services.model';
import { NotificationServiceMock } from '@testsUT/shared/shared-mock-services.model';
import { of, throwError } from 'rxjs';
import { MealsSearchListService } from './meals-search-list.service';

const productsMock = [product1, product2];
describe('MealsSearchListService', () => {
  let injector: TestBed;
  let productsApiService: ProductsApiService;
  let notificationService: NotificationService;
  let service: MealsSearchListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MealsSearchListService,
        {
          provide: ProductsApiService,
          useClass: ProductsApiServiceMock,
        },
        {
          provide: NotificationService,
          useClass: NotificationServiceMock,
        },
      ],
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    productsApiService = injector.inject(ProductsApiService);
    notificationService = injector.inject(NotificationService);
    service = injector.inject(MealsSearchListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get products by searchText successfully', () => {
    let products: Product[];
    spyOn(productsApiService, 'findProductsBy').and.returnValue(
      of(productsMock)
    );

    service
      .findProductsBy('searchText')
      .subscribe((p: Product[]) => (products = p));

    expect(products).toBeTruthy();
    expect(products.length).toEqual(2);
    expect(products).toEqual(productsMock);
  });

  it('should get products by searchText successfully', () => {
    let products: Product[];
    spyOn(productsApiService, 'findProductsBy').and.returnValue(
      of(productsMock)
    );
    spyOn(notificationService, 'success');
    spyOn(notificationService, 'error');

    service
      .findProductsBy('searchText')
      .subscribe((p: Product[]) => (products = p));

    expect(productsApiService.findProductsBy).toHaveBeenCalled();
    expect(notificationService.success).toHaveBeenCalled();
    expect(notificationService.error).not.toHaveBeenCalled();
    expect(products).toBeTruthy();
    expect(products.length).toEqual(2);
    expect(products).toEqual(productsMock);
  });

  it('should fail to get products by searchText successfully', () => {
    let products: Product[];
    spyOn(productsApiService, 'findProductsBy').and.returnValue(
      throwError('Error')
    );
    spyOn(notificationService, 'success');
    spyOn(notificationService, 'error');

    service
      .findProductsBy('searchText')
      .subscribe((p: Product[]) => (products = p));

    expect(productsApiService.findProductsBy).toHaveBeenCalled();
    expect(notificationService.success).not.toHaveBeenCalled();
    expect(notificationService.error).toHaveBeenCalled();
    expect(products).toBeTruthy();
    expect(products.length).toEqual(0);
  });
});
