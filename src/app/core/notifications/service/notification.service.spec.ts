import { ComponentType } from '@angular/cdk/portal';
import { fakeAsync, getTestBed, TestBed, tick } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { NotificationComponent } from '../component/notification.component';
import { NotificationColor } from '../models/notification-color';
import { NotificationConfig } from '../models/notification-config';
import { NotificationService } from './notification.service';

class MatSnackBarMock {
  public openFromComponent(): void {}
}

describe('NotificationService', () => {
  let injector: TestBed;
  let service: NotificationService;
  let matSnackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        {
          provide: MatSnackBar,
          useClass: MatSnackBarMock,
        },
      ],
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    matSnackBar = injector.inject(MatSnackBar);
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open success snackbar', () => {
    let configuration: MatSnackBarConfig<any>;
    let componentType: ComponentType<NotificationComponent>;
    const duration = 1000;
    const message = 'info message';
    const openFromComponentSpy = spyOn(
      matSnackBar,
      'openFromComponent'
    ).and.callFake((component, config) => {
      configuration = config;
      componentType = (component as unknown) as ComponentType<
        NotificationComponent
      >;
      return null;
    });

    service.success(message, duration);

    expect(openFromComponentSpy).toHaveBeenCalled();
    expect(componentType).toEqual(NotificationComponent);
    expect(configuration).toEqual({
      duration: 1000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      data: new NotificationConfig().setMessage(message).setDuration(duration),
    });
  });

  it('should open error snackbar', () => {
    let configuration: MatSnackBarConfig<any>;
    let componentType: ComponentType<NotificationComponent>;
    const duration = 1000;
    const message = 'info message';
    const openFromComponentSpy = spyOn(
      matSnackBar,
      'openFromComponent'
    ).and.callFake((component, config) => {
      configuration = config;
      componentType = (component as unknown) as ComponentType<
        NotificationComponent
      >;
      return null;
    });

    service.error(message, duration);

    expect(openFromComponentSpy).toHaveBeenCalled();
    expect(componentType).toEqual(NotificationComponent);
    expect(configuration).toEqual({
      duration: 1000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      data: new NotificationConfig()
        .setMessage(message)
        .setDuration(duration)
        .setColor(NotificationColor.RED),
    });
  });

  it('should open warning snackbar', () => {
    let configuration: MatSnackBarConfig<any>;
    let componentType: ComponentType<NotificationComponent>;
    const duration = 1000;
    const message = 'info message';
    const openFromComponentSpy = spyOn(
      matSnackBar,
      'openFromComponent'
    ).and.callFake((component, config) => {
      configuration = config;
      componentType = (component as unknown) as ComponentType<
        NotificationComponent
      >;
      return null;
    });

    service.warrning(message, duration);

    expect(openFromComponentSpy).toHaveBeenCalled();
    expect(componentType).toEqual(NotificationComponent);
    expect(configuration).toEqual({
      duration: 1000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      data: new NotificationConfig()
        .setMessage(message)
        .setDuration(duration)
        .setColor(NotificationColor.YELLOW),
    });
  });

  it('should open info snackbar', () => {
    let configuration: MatSnackBarConfig<any>;
    let componentType: ComponentType<NotificationComponent>;
    const duration = 1000;
    const message = 'info message';
    const openFromComponentSpy = spyOn(
      matSnackBar,
      'openFromComponent'
    ).and.callFake((component, config) => {
      configuration = config;
      componentType = (component as unknown) as ComponentType<
        NotificationComponent
      >;
      return null;
    });

    service.info(message, duration);

    expect(openFromComponentSpy).toHaveBeenCalled();
    expect(componentType).toEqual(NotificationComponent);
    expect(configuration).toEqual({
      duration: 1000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      data: new NotificationConfig()
        .setMessage(message)
        .setDuration(duration)
        .setColor(NotificationColor.PURPLE),
    });
  });

  it('should handle multiple snackbars', fakeAsync(() => {
    let configuration: MatSnackBarConfig<any>;
    const duration = 1000;
    const message = 'info message';
    const openFromComponentSpy = spyOn(
      matSnackBar,
      'openFromComponent'
    ).and.callFake((component, config) => {
      configuration = config;
      return null;
    });

    service.success(message, duration);
    service.success(message, duration);
    expect(openFromComponentSpy).toHaveBeenCalledTimes(1);

    tick(5000);
    expect(openFromComponentSpy).toHaveBeenCalledTimes(2);
  }));
});
