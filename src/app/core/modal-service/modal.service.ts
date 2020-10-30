import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InformationModalComponent } from './components/information-modal/information-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private dialog: MatDialog) {}

  public openDialog() {
    this.dialog.open(InformationModalComponent);
  }
}
