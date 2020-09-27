import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokensAction } from '@core/stores/tokens/tokens.actions';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppState } from 'src/app/reducers';

export enum MenuItems {
  MAIN_PAGE = '/main/home',
  DIARY = '/main/diary',
  REPORTS = '/main/reports',
  FRIENDS = '/main/friends',
  ACCOUNT = '/main/account',
  LOG_OUT = '/landing-page',
}

@Injectable({
  providedIn: 'root',
})
export class NavigationMediatorService {
  private currentlySelectedMenuItem$ = new BehaviorSubject<MenuItems>(
    MenuItems.DIARY
  );

  constructor(private router: Router, private store: Store<AppState>) {}

  public setClickedMenuItem(menuItem: MenuItems): void {
    this.router.navigateByUrl(menuItem);
    if (menuItem === MenuItems.LOG_OUT) {
      this.store.dispatch(TokensAction.CLEAR_TOKENS_REQUEST());
      return;
    }
    this.currentlySelectedMenuItem$.next(menuItem);
  }

  public getCurrentlySelectedMenuItem$(): Observable<MenuItems> {
    return this.currentlySelectedMenuItem$.asObservable();
  }
}
