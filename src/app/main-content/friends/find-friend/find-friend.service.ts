import { Injectable } from '@angular/core';
import { UserApiService } from '@api/user/user-api.service';
import { ErrorFormat } from '@core/models/error-format.model';
import { NotificationService } from '@core/notifications/service/notification.service';
import { User } from '@core/stores/user/user.model';
import { select, Store } from '@ngrx/store';
import { NGXLogger } from 'ngx-logger';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';

@Injectable({
  providedIn: 'root',
})
export class FindFriendService {
  private readonly signature = '[FF.S]';
  private readonly errorMessage = 'Failed to find users';

  constructor(
    private userApiService: UserApiService,
    private notificationService: NotificationService,
    private store: Store<AppState>,
    private logger: NGXLogger
  ) {}

  public findUsersBy(searchText: string): Observable<User[]> {
    return this.userApiService.findUsersBy(searchText).pipe(
      switchMap((users: User[]) => {
        return this.store.pipe(
          select('user'),
          map((user: User) => users.filter((u: User) => u.id !== user.id))
        );
      }),
      tap((u) => this.showSuccessNotification(u)),
      catchError((error: ErrorFormat) => {
        this.logger.log(
          `${this.signature} failed to find users by ${searchText}. Error: ${error.error}`
        );
        this.notificationService.error(this.errorMessage);
        return of([]);
      })
    );
  }

  private showSuccessNotification(u: User[]): void {
    if (u.length) {
      this.notificationService.success(`Found ${u.length} users`);
    } else {
      this.notificationService.info('Did not find any users');
    }
  }
}
