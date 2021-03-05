import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  @Output()
  public menuClick = new EventEmitter();
  constructor() {}

  public ngOnInit(): void {}

  public onMenuClick(): void {
    this.menuClick.emit();
  }
}
