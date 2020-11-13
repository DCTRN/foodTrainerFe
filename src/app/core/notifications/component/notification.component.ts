import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { NotificationColor } from '../models/notification-color';
import { NotificationConfig } from '../models/notification-config';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit, AfterViewInit {
  @ViewChild('progress', { static: true }) progress: HTMLDivElement;
  public notificationWidth = 0;
  public color = NotificationColor.PURPLE;
  public showIcon = false;
  private notificationTime: number;
  private currentTime = 0;

  private readonly interval = 10;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: NotificationConfig,
    private snackBar: MatSnackBar,
    private cdref: ChangeDetectorRef
  ) {
    this.notificationTime = this.data.getDuration();
    this.color = this.data.getColor();
  }

  @HostListener('click', ['$event'])
  public clickHandler(event: Event): void {
    this.snackBar.dismiss();
  }

  @HostListener('mouseenter', ['$event'])
  public mouseEnterHandler(event: Event): void {
    this.showIcon = true;
    console.log('mouseenter', this.showIcon);
    this.cdref.detectChanges();
  }

  @HostListener('mouseleave', ['$event'])
  public mouseLeaveHandler(event: Event): void {
    this.showIcon = false;
    console.log('mouseleave', this.showIcon);
    this.cdref.detectChanges();
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
