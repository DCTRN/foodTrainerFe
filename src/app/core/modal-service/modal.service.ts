import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InformationModalComponent } from './components/information-modal/information-modal.component';
import { ModalConfiguration } from './models/modal-configuration';

@Injectable()
export class ModalService {
  private modals: ModalConfiguration[] = [];
  private lastModal: ModalConfiguration;

  constructor(private dialog: MatDialog) {}

  public openDialog(modalConfiguration: ModalConfiguration): void {
    if (this.canNotAddModal(modalConfiguration.getId())) {
      return;
    }
    this.modals.push(modalConfiguration);
    this.sortModalsByPriorityDescending();
    this.open();
  }

  public closeDialog(modalId: string): void {
    const index = this.findModalIndexByModalId(modalId);
    if (index === -1) {
      return;
    }
    this.modals.splice(index, 1);
    this.sortModalsByPriorityDescending();
    this.dialog.closeAll();
    this.open();
  }

  public getDialogs(): ModalConfiguration[] {
    return this.modals;
  }

  private canNotAddModal(id: string) {
    return !id || this.isModalPresent(id);
  }

  private open() {
    if (!this.modals.length) {
      return;
    }

    this.lastModal = this.modals[0];
    this.dialog.open(InformationModalComponent, {
      data: {
        modalConfiguration: this.modals[0],
      },
    });
  }

  private sortModalsByPriorityDescending() {
    this.modals = this.modals.sort(
      (a: ModalConfiguration, b: ModalConfiguration) => {
        return b.getPriority() - a.getPriority();
      }
    );
  }

  private isModalPresent(modalId: string): boolean {
    const index = this.findModalIndexByModalId(modalId);
    return index !== -1;
  }

  private findModalIndexByModalId(modalId: string) {
    return this.modals.findIndex((modal) => modal.getId() === modalId);
  }
}
