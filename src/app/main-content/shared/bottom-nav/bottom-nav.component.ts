import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  MenuItems,
  NavigationMediatorService,
} from '../services/navigation-mediator/navigation-mediator.service';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
})
export class BottomNavComponent implements OnInit, OnDestroy {
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
