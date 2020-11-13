import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, Subject } from 'rxjs';
import { concatMap, delay, tap } from 'rxjs/operators';
import { NotificationComponent } from '../component/notification.component';
import { NotificationColor } from '../models/notification-color';
import { NotificationConfig } from '../models/notification-config';
import { NotificationHandlerMetaData } from '../models/notification-handler-meta-data';
import { NotificationType } from '../models/notification-type';

@Injectable()
export class NotificationService {
  private notificationHandlers = new Map<
    NotificationType,
    (message: string, duration: number) => void
  >([
    [
      NotificationType.SUCCESS,
      (message: string, duration: number = 5000) => {
        this.openSuccessSnackBar(message, duration);
      },
    ],
    [
      NotificationType.ERROR,
      (message: string, duration: number = 5000) => {
        this.openErrorSnackBar(message, duration);
      },
    ],
    [
      NotificationType.WARNING,
      (message: string, duration: number = 5000) => {
        this.openWarrningSnackBar(message, duration);
      },
    ],
    [
      NotificationType.INFO,
      (message: string, duration: number = 5000) => {
        this.openInfoSnackBar(message, duration);
      },
    ],
  ]);

  private openSnackBar$ = new Subject<NotificationHandlerMetaData>();
  private readonly delayDelta = 200;

  constructor(private matSnackBar: MatSnackBar) {
    this.notificationEventsHandler();
  }

  public success(message: string, duration: number = 5000): void {
    this.openSnackBar$.next({
      type: NotificationType.SUCCESS,
      message,
      duration,
    });
  }

  public error(message: string, duration: number = 5000): void {
    this.openSnackBar$.next({
      type: NotificationType.ERROR,
      message,
      duration,
    });
  }

  public warrning(message: string, duration: number = 5000): void {
    this.openSnackBar$.next({
      type: NotificationType.WARNING,
      message,
      duration,
    });
  }

  public info(message: string, duration: number = 5000): void {
    this.openSnackBar$.next({
      type: NotificationType.INFO,
      message,
      duration,
    });
  }

  private notificationEventsHandler() {
    this.openSnackBar$
      .pipe(concatMap((d) => this.openNotification(d)))
      .subscribe();
  }

  private openNotification(d: NotificationHandlerMetaData) {
    this.notificationHandlers.get(d.type)(d.message, d.duration);
    return of(d).pipe(delay(d.duration + this.delayDelta));
  }

  private openSuccessSnackBar(message: string, duration: number = 5000) {
    this.matSnackBar.openFromComponent(NotificationComponent, {
      duration,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      data: new NotificationConfig().setMessage(message).setDuration(duration),
    });
  }

  private openErrorSnackBar(message: string, duration: number = 5000) {
    this.matSnackBar.openFromComponent(NotificationComponent, {
      duration,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      data: new NotificationConfig()
        .setMessage(message)
        .setDuration(duration)
        .setColor(NotificationColor.RED),
    });
  }

  private openWarrningSnackBar(message: string, duration: number = 5000) {
    this.matSnackBar.openFromComponent(NotificationComponent, {
      duration,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      data: new NotificationConfig()
        .setMessage(message)
        .setDuration(duration)
        .setColor(NotificationColor.YELLOW),
    });
  }

  private openInfoSnackBar(message: string, duration: number = 5000) {
    this.matSnackBar.openFromComponent(NotificationComponent, {
      duration,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      data: new NotificationConfig()
        .setMessage(message)
        .setDuration(duration)
        .setColor(NotificationColor.PURPLE),
    });
  }
}
