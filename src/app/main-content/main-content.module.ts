import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BottomNavModule } from '@shared/bottom-nav/bottom-nav.module';
import { DrawerModule } from '@shared/drawer/drawer.module';
import { IconRegistryModule } from '@shared/icon-registry/icon-registry.module';
import { ToolbarModule } from '@shared/toolbar/toolbar.module';
import { MainContentRoutingModule } from './main-content-routing.module';
import { MainContentComponent } from './main-content.component';

@NgModule({
  declarations: [MainContentComponent],
  imports: [
    CommonModule,
    MainContentRoutingModule,
    BottomNavModule,
    ToolbarModule,
    DrawerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    IconRegistryModule,
    MatCardModule,
  ],
  exports: [MainContentComponent],
})
export class MainContentModule {}
