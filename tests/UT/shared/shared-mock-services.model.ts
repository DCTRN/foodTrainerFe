export class NotificationServiceMock {
  public success(message: string, duration: number = 5000): void {}
  public error(message: string, duration: number = 5000): void {}
  public warrning(message: string, duration: number = 5000): void {}
  public info(message: string, duration: number = 5000): void {}
}
