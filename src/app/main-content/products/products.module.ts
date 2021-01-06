import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconRegistryModule } from '@main-content/shared/icon-registry/icon-registry.module';
import { ProductDetailsModule } from './product-details/product-details.module';
import { ProductWrapperComponent } from './product-wrapper/product-wrapper.component';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { UserProductsListComponent } from './user-products-list/user-products-list.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ProductsListComponent } from './products-list/products-list.component';

@NgModule({
  declarations: [
    ProductsComponent,
    UserProductsListComponent,
    ProductWrapperComponent,
    AddProductComponent,
    ProductsListComponent,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ProductDetailsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatButtonModule,
    MatTabsModule,
    MatTooltipModule,
    MatCardModule,
    MatRippleModule,
    MatDividerModule,
    MatExpansionModule,
    IconRegistryModule,
  ],
  exports: [
    ProductsComponent,
    UserProductsListComponent,
    ProductWrapperComponent,
    AddProductComponent,
    ProductsListComponent,
  ],
})
export class ProductsModule {}
