import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationComponent } from './component/notification.component';
import { NotificationService } from './service/notification.service';
import { MatRippleModule } from '@angular/material/core';
import { IconRegistryModule } from '@main-content/shared/icon-registry/icon-registry.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatCardModule,
    MatButtonModule,
    MatRippleModule,
    IconRegistryModule,
    MatProgressBarModule,
  ],
  declarations: [NotificationComponent],
  providers: [NotificationService],
  exports: [NotificationComponent],
})
export class NotificationModule {}
