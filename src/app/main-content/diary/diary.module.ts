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
import { ProductsModule } from '@main-content/products/products.module';
import { IconRegistryModule } from '@main-content/shared/icon-registry/icon-registry.module';
import { DiaryRoutingModule } from './diary-routing.module';
import { DiaryComponent } from './diary.component';
import { MealsContainerComponent } from './meals-container/meals-container.component';
import { MatTableModule } from '@angular/material/table';
import { MealsConatainerListComponent } from './meals-container-list/meals-conatainer-list.component';
import { MealsSearchListComponent } from './meals-search-list/meals-search-list.component';

@NgModule({
  declarations: [
    DiaryComponent,
    MealsContainerComponent,
    MealsConatainerListComponent,
    MealsSearchListComponent,
  ],
  imports: [
    CommonModule,
    DiaryRoutingModule,
    ProductsModule,
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
    MatTableModule,
  ],
})
export class DiaryModule {}
