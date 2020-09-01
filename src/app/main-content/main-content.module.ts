import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainContentRoutingModule } from './main-content-routing.module';
import { BottomNavModule } from './shared/bottom-nav/bottom-nav.module';
import { MainNavModule } from './shared/main-nav/main-nav.module';
import { MainContentComponent } from './main-content.component';


@NgModule({
  declarations: [MainContentComponent],
  imports: [
    CommonModule,
    MainContentRoutingModule,
    BottomNavModule,
    MainNavModule
  ]
})
export class MainContentModule { }
