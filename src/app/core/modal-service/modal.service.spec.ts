import { getTestBed, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalService } from './modal.service';
import { ModalConfiguration } from './models/modal-configuration';
import { ModalPriority } from './models/modal-priority.enum';

class MatDialogMock {
  public open(): void {}
  public closeAll(): void {}
}

const modalConfiguration1 = new ModalConfiguration();
const modalConfiguration2 = new ModalConfiguration();
const id1 = 'modal1';
const id2 = 'modal2';

// TODO eventually make close / open mechanism work better

describe('ModalService', () => {
  let injector: TestBed;
  let service: ModalService;
  let matDialog: MatDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, BrowserAnimationsModule],
      providers: [
        ModalService,
        {
          provide: MatDialog,
          useClass: MatDialogMock,
        },
      ],
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    matDialog = injector.inject(MatDialog);
    service = injector.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open and close dialog', () => {
    let modals: ModalConfiguration[] = [];
    const openDialogSpy = spyOn(matDialog, 'open');
    const closeAllSpy = spyOn(matDialog, 'closeAll');

    const modalConfiguration = new ModalConfiguration();
    const id1 = 'modal1';
    modalConfiguration.setId(id1);

    service.openDialog(modalConfiguration);
    modals = service.getDialogs();
    expect(modals.length).toEqual(1);

    service.closeDialog(id1);
    service.closeDialog(id1);
    modals = service.getDialogs();
    expect(modals.length).toEqual(0);

    expect(openDialogSpy).toHaveBeenCalled();
    expect(closeAllSpy).toHaveBeenCalledTimes(1);
  });

  it('should test if sorting and closing works properly for low - high order', () => {
    let modals: ModalConfiguration[] = [];
    const openDialogSpy = spyOn(matDialog, 'open');
    const closeAllSpy = spyOn(matDialog, 'closeAll');

    modalConfiguration1.setId(id1);
    modalConfiguration1.setPriority(ModalPriority.LOW);
    modalConfiguration2.setId(id2);
    modalConfiguration2.setPriority(ModalPriority.HIGH);

    service.openDialog(modalConfiguration1);
    service.openDialog(modalConfiguration2);
    modals = service.getDialogs();

    expect(modals.length).toEqual(2);
    expect(modals[0].getId()).toEqual(id2);
    expect(modals[1].getId()).toEqual(id1);

    service.closeDialog(id2);
    service.closeDialog(id2);
    modals = service.getDialogs();

    expect(modals.length).toEqual(1);
    expect(modals[0].getId()).toEqual(id1);
    expect(openDialogSpy).toHaveBeenCalledTimes(3);
    expect(closeAllSpy).toHaveBeenCalledTimes(1);
  });

  it('should test if sorting and closing works properly for high - low order', () => {
    let modals: ModalConfiguration[] = [];
    const openDialogSpy = spyOn(matDialog, 'open');
    const closeAllSpy = spyOn(matDialog, 'closeAll');

    modalConfiguration1.setId(id1);
    modalConfiguration1.setPriority(ModalPriority.LOW);
    modalConfiguration2.setId(id2);
    modalConfiguration2.setPriority(ModalPriority.HIGH);

    service.openDialog(modalConfiguration2);
    service.openDialog(modalConfiguration1);
    modals = service.getDialogs();

    expect(modals.length).toEqual(2);
    expect(modals[0].getId()).toEqual(id2);
    expect(modals[1].getId()).toEqual(id1);

    service.closeDialog(id2);
    service.closeDialog(id2);
    modals = service.getDialogs();

    expect(modals.length).toEqual(1);
    expect(modals[0].getId()).toEqual(id1);
    // TODO make it 2 to be more efficient
    expect(openDialogSpy).toHaveBeenCalledTimes(3);
    expect(closeAllSpy).toHaveBeenCalledTimes(1);
  });
});
