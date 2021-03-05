import {
  async,
  ComponentFixture,
  TestBed,
  getTestBed,
} from '@angular/core/testing';

import {
  LandingPageComponent,
  LandingPageNavigationDestiny,
} from './landing-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';

describe('LandingPageComponent', () => {
  let injector: TestBed;
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [LandingPageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    fixture = injector.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = injector.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login', () => {
    const routerSpy = spyOn(router, 'navigateByUrl');

    component.navigate(LandingPageNavigationDestiny.LOGIN);

    expect(routerSpy).toHaveBeenCalledWith('/login');
  });

  it('should navigate to register', () => {
    const routerSpy = spyOn(router, 'navigateByUrl');

    component.navigate(LandingPageNavigationDestiny.REGISTER);

    expect(routerSpy).toHaveBeenCalledWith('/register');
  });
});
