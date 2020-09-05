import { Component } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Router, NavigationEnd, RouterEvent } from '@angular/router';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public title = 'food-trainer';
  private readonly signature = '[APP.C]';

  constructor(private logger: NGXLogger, private router: Router) {
    this.logger.log(`${this.signature} ${this.title} started!`);
    this.router.events
      .pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd),
        tap((event: NavigationEnd) =>
          this.logger.log(`${this.signature} navigated to: ${event.url}`)
        )
      )
      .subscribe();
  }
}
