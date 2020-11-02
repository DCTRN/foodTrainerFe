import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-information-modal',
  templateUrl: './information-modal.component.html',
  styleUrls: ['./information-modal.component.css'],
})
export class InformationModalComponent implements OnInit {
  public icon = 'info';
  public headerClasses = [];
  private baseHeaderClass = 'header';
  constructor(private dialogRef: MatDialogRef<InformationModalComponent>) {
    this.dialogRef.disableClose = true;
    this.headerClasses.push(this.baseHeaderClass);
  }

  public ngOnInit(): void {}
}
