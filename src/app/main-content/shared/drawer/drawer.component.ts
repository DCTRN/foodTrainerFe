import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserAction } from '@core/stores/user/user.actions';
import { User } from '@core/stores/user/user.model';
import { select, Store } from '@ngrx/store';
import {
  MenuItems,
  NavigationMediatorService,
} from '@shared/services/navigation-mediator/navigation-mediator.service.ts';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/reducers';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent implements OnInit, OnDestroy {
  public menuItems = MenuItems;
  public currentlySelectedMenuItem: MenuItems;
  public user: User;
  private subscriptions = new Subscription();

  constructor(
    private navigationMediatorService: NavigationMediatorService,
    private store: Store<AppState>
  ) {}

  public ngOnInit(): void {
    this.subscribeToCurrentlySelectedMenuItem();
    this.store.dispatch(UserAction.GET_CREDENTIALS_REQUEST());
    this.store.pipe(select('user')).subscribe((u: User) => (this.user = u));
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onMenuItemClick(menuItem: MenuItems): void {
    this.navigationMediatorService.setClickedMenuItem(menuItem);
  }

  private subscribeToCurrentlySelectedMenuItem(): void {
    this.subscriptions.add(
      this.navigationMediatorService
        .getCurrentlySelectedMenuItem$()
        .subscribe((item: MenuItems) => (this.currentlySelectedMenuItem = item))
    );
  }
}
