import { HttpClientTestingModule } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TokensAction } from '@core/stores/tokens/tokens.actions';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  MenuItems,
  NavigationMediatorService,
} from './navigation-mediator.service';

describe('NavigationMediatorService', () => {
  let injector: TestBed;
  let service: NavigationMediatorService;
  let router: Router;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        provideMockStore({ initialState: {} }),
        NavigationMediatorService,
      ],
    });
    injector = getTestBed();
    service = injector.inject(NavigationMediatorService);
    router = injector.inject(Router);
    store = injector.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle menu click', () => {
    let currentlySelectedMenuItem: MenuItems;
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    service.setClickedMenuItem(MenuItems.DIARY);
    service
      .getCurrentlySelectedMenuItem$()
      .subscribe(
        (selectedItem: MenuItems) => (currentlySelectedMenuItem = selectedItem)
      );

    expect(navigateByUrlSpy).toHaveBeenCalledWith(MenuItems.DIARY);
    expect(currentlySelectedMenuItem).toEqual(MenuItems.DIARY);
  });

  it('should handle menu click on log out', () => {
    let currentlySelectedMenuItem: MenuItems;
    const dispatchSpy = spyOn(store, 'dispatch');
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    service.setClickedMenuItem(MenuItems.LOG_OUT);
    service
      .getCurrentlySelectedMenuItem$()
      .subscribe(
        (selectedItem: MenuItems) => (currentlySelectedMenuItem = selectedItem)
      );

    expect(dispatchSpy).toHaveBeenCalledWith(
      TokensAction.CLEAR_TOKENS_REQUEST()
    );
    expect(navigateByUrlSpy).toHaveBeenCalledWith(MenuItems.LOG_OUT);
    expect(currentlySelectedMenuItem).not.toEqual(MenuItems.LOG_OUT);
  });
});
