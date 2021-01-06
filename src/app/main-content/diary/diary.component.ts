import { Component, OnInit } from '@angular/core';
import { ProductWrapperDisplayType } from '@core/models/products';
import { product1 } from '@testsUT/products/products-mock-data.model';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss'],
})
export class DiaryComponent implements OnInit {
  public product = product1;
  public display = ProductWrapperDisplayType.DIARY_SUMMARY;

  constructor() {}

  public ngOnInit(): void {}
}
