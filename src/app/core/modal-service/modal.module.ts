import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { IconRegistryModule } from '@main-content/shared/icon-registry/icon-registry.module';
import { InformationModalComponent } from './components/information-modal/information-modal.component';
import { ModalService } from './modal.service';

@NgModule({
  declarations: [InformationModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    IconRegistryModule,
  ],
  providers: [ModalService],
  exports: [InformationModalComponent],
})
export class ModalModule {}
