import {
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { NotificationConfig } from '../models/notification-config';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit, AfterViewInit {
  @ViewChild('progress', { static: true }) progress: HTMLDivElement;
  public notificationWidth = 0;
  private notificationTime: number;
  private currentTime = 0;

  private readonly interval = 10;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: NotificationConfig,
    private snackBar: MatSnackBar
  ) {
    this.notificationTime = this.data.getDuration();
  }

  @HostListener('click', ['$event'])
  public clickHandler(event: Event): void {
    this.snackBar.dismiss();
  }

  public ngOnInit(): void {}

  public ngAfterViewInit(): void {
    interval(this.interval)
      .pipe(takeWhile(() => this.currentTime < this.notificationTime))
      .subscribe(() => {
        this.currentTime += this.interval;
        this.notificationWidth = Math.ceil(
          (this.currentTime / this.notificationTime) * 100
        );
      });
  }
}
