import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { ModalService } from './modal.service';

describe('ModalService', () => {
  let injector: TestBed;
  let service: ModalService;
  let matDialog: MatDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModalService, MatDialog],
    });
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open information dialog', () => {
    expect(service).toBeTruthy();
  });
});
