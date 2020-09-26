import { HttpClientTestingModule } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  MenuItems,
  NavigationMediatorService,
} from './navigation-mediator.service';

describe('NavigationMediatorService', () => {
  let injector: TestBed;
  let service: NavigationMediatorService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [NavigationMediatorService],
    });
    injector = getTestBed();
    service = injector.inject(NavigationMediatorService);
    router = injector.inject(Router);
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
    expect(service).toBeTruthy();
  });
});
