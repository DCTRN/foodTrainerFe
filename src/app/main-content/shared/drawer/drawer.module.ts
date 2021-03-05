import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerComponent } from './drawer.component';
import { MatCardModule } from '@angular/material/card';
import { IconRegistryModule } from '../icon-registry/icon-registry.module';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [DrawerComponent],
  imports: [CommonModule, IconRegistryModule, MatCardModule, MatDividerModule],
  exports: [DrawerComponent],
})
export class DrawerModule {}
