import { NotificationPosition } from './notification-position';
import { NotificationColor } from './notification-color';

export class NotificationConfig {
  constructor(
    private message?: string,
    private duration?: number,
    private color: NotificationColor = NotificationColor.GREEN,
    private position: NotificationPosition = {
      vertical: 'bottom',
      horizontal: 'right',
    }
  ) {}

  public setMessage(message: string): NotificationConfig {
    this.message = message;
    return this;
  }

  public setDuration(duration: number): NotificationConfig {
    this.duration = duration;
    return this;
  }

  public setColor(color: NotificationColor): NotificationConfig {
    this.color = color;
    return this;
  }

  public setPosition(position: NotificationPosition): NotificationConfig {
    this.position = position;
    return this;
  }

  public getMessage(): string {
    return this.message;
  }

  public getDuration(): number {
    return this.duration;
  }

  public getColor(): NotificationColor {
    return this.color;
  }

  public getPosition(): NotificationPosition {
    return this.position;
  }
}
