import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { IconRegistryModule } from '@main-content/shared/icon-registry/icon-registry.module';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { ErrorModalComponent } from './components/error-modal/error-modal.component';
import { InformationModalComponent } from './components/information-modal/information-modal.component';
import { WarningModalComponent } from './components/warning-modal/warning-modal.component';

@NgModule({
  declarations: [
    ConfirmationModalComponent,
    ErrorModalComponent,
    InformationModalComponent,
    WarningModalComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    IconRegistryModule,
  ],
  exports: [
    ConfirmationModalComponent,
    ErrorModalComponent,
    InformationModalComponent,
    WarningModalComponent,
  ],
})
export class ModalModule {}
