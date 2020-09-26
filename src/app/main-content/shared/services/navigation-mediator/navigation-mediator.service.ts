import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';

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

  constructor(private router: Router) {}

  public setClickedMenuItem(menuItem: MenuItems): void {
    this.router.navigateByUrl(menuItem);
    if (menuItem === MenuItems.LOG_OUT) {
      return;
    }
    this.currentlySelectedMenuItem$.next(menuItem);
  }

  public getCurrentlySelectedMenuItem$(): Observable<MenuItems> {
    return this.currentlySelectedMenuItem$.asObservable();
  }
}
