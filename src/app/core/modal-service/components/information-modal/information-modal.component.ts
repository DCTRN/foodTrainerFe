import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Button } from '@core/modal-service/models/button';
import { ButtonPosition } from '@core/modal-service/models/button-position.enum';
import { Content } from '@core/modal-service/models/content';
import { Footer } from '@core/modal-service/models/footer';
import { Header } from '@core/modal-service/models/header';
import { ModalConfiguration } from '@core/modal-service/models/modal-configuration';

@Component({
  selector: 'app-information-modal',
  templateUrl: './information-modal.component.html',
  styleUrls: ['./information-modal.component.scss'],
})
export class InformationModalComponent implements OnInit {
  public id: string;
  public header = new Header();
  public icon: string;
  public content = new Content();
  public footer = new Footer();
  public leftButtons: Button[] = [];
  public rightButtons: Button[] = [];
  public baseHeader = 'header';

  private config: ModalConfiguration;
  constructor(
    private dialogRef: MatDialogRef<InformationModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    // TODO change to generic interface
    public data: { modalConfiguration: ModalConfiguration }
  ) {
    this.config = data.modalConfiguration;
    this.dialogRef.disableClose = true;
    this.id = this.config.getId();
    this.header = this.config.getHeader();
    this.content = this.config.getContent();
    this.footer = this.config.getFooter();
    for (const button of this.footer.getButtons()) {
      if (button.getPosition() === ButtonPosition.RIGHT) {
        this.rightButtons.push(button);
      } else {
        this.leftButtons.push(button);
      }
    }
  }

  public ngOnInit(): void {}
}
