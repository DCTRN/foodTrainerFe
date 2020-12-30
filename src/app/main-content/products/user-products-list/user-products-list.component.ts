import { Component, OnInit } from '@angular/core';
import { Product } from '@core/models/products';
import {
  product1,
  product2,
  product3,
} from '@testsUT/products/products-mock-data.model';

@Component({
  selector: 'app-user-products-list',
  templateUrl: './user-products-list.component.html',
  styleUrls: ['./user-products-list.component.scss'],
})
export class UserProductsListComponent implements OnInit {
  public products = [product1, product2, product3];
  constructor() {}

  public ngOnInit(): void {}

  public onValue(value: Product): void {
    console.warn('new value', value);
  }
}
