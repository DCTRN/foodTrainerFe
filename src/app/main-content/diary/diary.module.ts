import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProductsModule } from '@main-content/products/products.module';
import { DiaryRoutingModule } from './diary-routing.module';
import { DiaryComponent } from './diary.component';

@NgModule({
  declarations: [DiaryComponent],
  imports: [CommonModule, DiaryRoutingModule, ProductsModule],
})
export class DiaryModule {}
