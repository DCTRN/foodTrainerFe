import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { Button } from '@core/modal-service/models/button';
import { ButtonPosition } from '@core/modal-service/models/button-position.enum';
import { ButtonType } from '@core/modal-service/models/button-type.enum';
import { Content } from '@core/modal-service/models/content';
import { Footer } from '@core/modal-service/models/footer';
import { Header } from '@core/modal-service/models/header';
import { HeaderColor } from '@core/modal-service/models/header-color.enum';
import { Icon } from '@core/modal-service/models/icon.enum';
import { ModalConfiguration } from '@core/modal-service/models/modal-configuration';
import { ModalPriority } from '@core/modal-service/models/modal-priority.enum';
import { InformationModalComponent } from './information-modal.component';

const modalId = 'modalId';
const modalTitile = 'Modal Title';
const modalIcon = Icon.WARNING;
const modalHeader = HeaderColor.GREEN_HEADER;
const modalText = ['TEXT1', 'TEXT2', 'TEXT3'];

const button1 = new Button()
  .setId('button1')
  .setText('Button 1')
  .setPosition(ButtonPosition.LEFT)
  .setType(ButtonType.SECONDARY)
  .setCallback(() => {});

const button2 = new Button()
  .setId('button2')
  .setText('Button 2')
  .setPosition(ButtonPosition.LEFT)
  .setType(ButtonType.SECONDARY)
  .setCallback(() => {});

const button3 = new Button()
  .setId('button3')
  .setText('Button 3')
  .setPosition(ButtonPosition.RIGHT)
  .setType(ButtonType.PRIMARY)
  .setCallback(() => {});

const button4 = new Button()
  .setId('button4')
  .setText('Button 4')
  .setPosition(ButtonPosition.RIGHT)
  .setType(ButtonType.PRIMARY)
  .setCallback(() => {});
const buttons = [button1, button2, button3, button4];
const modalConfig = new ModalConfiguration();
const header = new Header();
const content = new Content();
const footer = new Footer();

header.setTitle(modalTitile);
header.setIcon(modalIcon);
header.setColor(modalHeader);

content.setText(modalText);
footer.setButtons(buttons);

modalConfig.setId(modalId);
modalConfig.setPriority(ModalPriority.MEDIUM);
modalConfig.setHeader(header);
modalConfig.setContent(content);
modalConfig.setFooter(footer);

describe('InformationModalComponent', () => {
  let component: InformationModalComponent;
  let fixture: ComponentFixture<InformationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { modalConfiguration: modalConfig },
        },
      ],
      declarations: [InformationModalComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set modal id', () => {
    const idFromComponent = component.id;
    const idFromHtml = fixture.debugElement.query(By.css(`#${modalId}`));

    expect(idFromHtml).toBeTruthy();
    expect(idFromComponent).toBeTruthy();
    expect(idFromComponent).toEqual(modalId);
  });

  it('should set modal header', () => {
    fixture.detectChanges();
    const titleFromHtml = ((fixture.debugElement.query(By.css('h1'))
      .nativeElement as unknown) as HTMLHeadElement).innerText;
    const titleFromComponent = component.header.getTitle();
    const iconFromComponent = component.header.getIcon();
    const header = fixture.debugElement.query(By.css('header'));
    const headerClasses = ((header.nativeElement as unknown) as HTMLElement).getAttribute(
      'class'
    );

    expect(titleFromHtml).toEqual(modalTitile);
    expect(titleFromComponent).toEqual(modalTitile);
    expect(iconFromComponent).toEqual(modalIcon);
    expect(headerClasses).toContain(modalHeader);
  });

  it('should set modal content', () => {
    fixture.detectChanges();
    const numberOfParagraphs = fixture.debugElement.queryAll(By.css('p'));
    const paragraphsContent = numberOfParagraphs.map(
      (p) => ((p.nativeElement as unknown) as HTMLElement).innerText
    );

    expect(numberOfParagraphs.length).toEqual(3);
    expect(paragraphsContent[0]).toEqual(modalText[0]);
    expect(paragraphsContent[1]).toEqual(modalText[1]);
    expect(paragraphsContent[2]).toEqual(modalText[2]);
  });

  it('should set modal footer', () => {
    fixture.detectChanges();
    const numberOfPrimaryButtons = fixture.debugElement.queryAll(
      By.css('.primary')
    );
    const numberOfSecondaryButtons = fixture.debugElement.queryAll(
      By.css('.secondary')
    );

    const leftButtons = component.leftButtons;
    const rightButtons = component.rightButtons;

    expect(leftButtons.length).toEqual(2);
    expect(rightButtons.length).toEqual(2);

    expect(numberOfPrimaryButtons.length).toEqual(2);
    expect(numberOfSecondaryButtons.length).toEqual(2);
  });
});
