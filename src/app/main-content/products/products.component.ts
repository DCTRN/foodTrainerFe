import { Component, OnInit } from '@angular/core';
import { product1 } from '@testsUT/products/products-mock-data.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  public product = product1;
  constructor() {}

  public ngOnInit(): void {}
}
