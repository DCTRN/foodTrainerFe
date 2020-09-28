import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MainContentComponent } from './main-content.component';

@Component({
  selector: 'app-toolbar',
  template: '',
})
export class ToolbarComponentMock {}

@Component({
  selector: 'mat-drawer',
  template: '',
})
export class DrawerComponentMock {
  public opened = false;
  public toggle(): void {
    this.opened = !this.opened;
  }
}

describe('MainContentComponent', () => {
  let injector: TestBed;
  let component: MainContentComponent;
  let fixture: ComponentFixture<MainContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        MainContentComponent,
        ToolbarComponentMock,
        DrawerComponentMock,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    fixture = injector.createComponent(MainContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle drawer', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.drawer.opened).toEqual(false);

    component.onMenuClick();
    expect(component.drawer.opened).toEqual(true);

    component.onMenuClick();
    expect(component.drawer.opened).toEqual(false);
  });
});
