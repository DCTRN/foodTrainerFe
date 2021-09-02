import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CredentialsComponent } from './credentials/credentials.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { NutritionGoalsComponent } from './nutrition-goals/nutrition-goals.component';

@NgModule({
  declarations: [
    AccountComponent,
    CredentialsComponent,
    ChangePasswordComponent,
    NutritionGoalsComponent,
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatButtonModule,
    MatTabsModule,
    MatTooltipModule,
    MatSelectModule,
  ],
})
export class AccountModule {}
