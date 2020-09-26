import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottomNavComponent } from './bottom-nav.component';
import { MatCardModule } from '@angular/material/card';
import { IconRegistryModule } from '../icon-registry/icon-registry.module';

@NgModule({
  declarations: [BottomNavComponent],
  imports: [CommonModule, IconRegistryModule, MatCardModule],
  exports: [BottomNavComponent],
})
export class BottomNavModule {}
