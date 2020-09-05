import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export enum LandingPageNavigationDestiny {
  LOGIN = '/login',
  REGISTER = '/register',
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {
  public destiny = LandingPageNavigationDestiny;

  private readonly signature = '[LP.C]';

  private navigationHandlers = {
    [LandingPageNavigationDestiny.LOGIN]: () => {
      this.navigateToLogin();
    },
    [LandingPageNavigationDestiny.REGISTER]: () => {
      this.navigateToRegister();
    },
  };

  constructor(private router: Router) {}

  public ngOnInit(): void {}

  public navigate(destiny: LandingPageNavigationDestiny): void {
    this.navigationHandlers[destiny]();
  }

  private navigateToLogin() {
    this.router.navigateByUrl('/login');
  }

  private navigateToRegister() {
    this.router.navigateByUrl('/register');
  }
}
