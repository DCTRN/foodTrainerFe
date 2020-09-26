import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDrawer, MatDrawerMode } from '@angular/material/sidenav';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css'],
})
export class MainContentComponent implements OnInit {
  @ViewChild('drawer', { static: true }) drawer: MatDrawer;
  @ViewChild('menuButton', { static: true }) menuButton: MatButton;
  @ViewChild('menuIcon', { static: true }) menuIcon: MatIcon;
  public matDrawerMode: MatDrawerMode = 'over';
  constructor() {}

  public ngOnInit(): void {}

  public onMenuClick(): void {
    this.drawer.toggle();
  }
}
