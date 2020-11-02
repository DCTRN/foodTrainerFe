import { Button } from './button';
import { ButtonPosition } from './button-position.enum';
import { ButtonType } from './button-type.enum';
import { Footer } from './footer';

const button1 = new Button();
const id1 = 'buttonId';
const text1 = 'buttonText';
const type1 = ButtonType.SECONDARY;
const position1 = ButtonPosition.LEFT;
const callback1 = () => {};

button1.setId(id1);
button1.setText(text1);
button1.setType(type1);
button1.setPosition(position1);
button1.setCallback(callback1);

const button2 = new Button();
const id2 = 'buttonId2';
const text2 = 'buttonText2';
const type2 = ButtonType.PRIMARY;
const position2 = ButtonPosition.RIGHT;
const callback2 = () => {};

button2.setId(id2);
button2.setText(text2);
button2.setType(type2);
button2.setPosition(position2);
button2.setCallback(callback2);

describe('Footer', () => {
  it('should create empty instance', () => {
    expect(new Footer()).toBeTruthy();
  });

  it('should test footer methods', () => {
    const footer = new Footer();

    footer.addButton(button1);

    expect(footer.getButtons().length).toEqual(1);

    footer.deleteButton(button1.getId());
    footer.deleteButton(button1.getId());

    expect(footer.getButtons().length).toEqual(0);

    footer.setButtons([button1, button2]);
    expect(footer.getButtons().length).toEqual(2);

    footer.clearFooter();

    expect(footer.getButtons().length).toEqual(0);
  });
});
