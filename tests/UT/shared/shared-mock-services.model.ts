import { InformationModalComponent } from '@core/modal-service/components/information-modal/information-modal.component';
import { ModalConfiguration } from '@core/modal-service/models/modal-configuration';

export class NotificationServiceMock {
  public success(message: string, duration: number = 5000): void {}
  public error(message: string, duration: number = 5000): void {}
  public warrning(message: string, duration: number = 5000): void {}
  public info(message: string, duration: number = 5000): void {}
}

export class ModalServiceMock {
  public openDialog(modalConfiguration: ModalConfiguration): void {}
  public closeDialog(modalId: string): void {}
  public getDialogs(): ModalConfiguration[] {
    return [];
  }
}
