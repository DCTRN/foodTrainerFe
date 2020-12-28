import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconRegistryModule } from '@main-content/shared/icon-registry/icon-registry.module';
import { ProductDetailsComponent } from './product-details.component';

@NgModule({
  declarations: [ProductDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    MatRippleModule,
    MatDividerModule,
    IconRegistryModule,
  ],
  exports: [ProductDetailsComponent],
})
export class ProductDetailsModule {}
