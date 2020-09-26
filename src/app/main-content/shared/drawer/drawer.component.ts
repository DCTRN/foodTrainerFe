import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  MenuItems,
  NavigationMediatorService,
} from '@shared/services/navigation-mediator/navigation-mediator.service.ts';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css'],
})
export class DrawerComponent implements OnInit, OnDestroy {
  public menuItems = MenuItems;
  public currentlySelectedMenuItem: MenuItems;
  private subscriptions = new Subscription();
  constructor(private navigationMediatorService: NavigationMediatorService) {}

  public ngOnInit(): void {
    this.subscribeToCurrentlySelectedMenuItem();
  }

  private subscribeToCurrentlySelectedMenuItem() {
    this.subscriptions.add(
      this.navigationMediatorService
        .getCurrentlySelectedMenuItem$()
        .subscribe((item: MenuItems) => (this.currentlySelectedMenuItem = item))
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onMenuItemClick(menuItem: MenuItems): void {
    this.navigationMediatorService.setClickedMenuItem(menuItem);
  }
}
