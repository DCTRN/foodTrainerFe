import { Button } from './button';
import { ButtonPosition } from './button-position.enum';
import { ButtonType } from './button-type.enum';

describe('Button', () => {
  it('should create empty instance', () => {
    expect(new Button()).toBeTruthy();
  });

  it('should create full configuration button', () => {
    const button = new Button();
    const id = 'buttonId';
    const text = 'buttonText';
    const type = ButtonType.SECONDARY;
    const position = ButtonPosition.LEFT;
    const callback = () => {};

    button.setId(id);
    button.setText(text);
    button.setType(type);
    button.setPosition(position);
    button.setCallback(callback);

    expect(button.getId()).toEqual(id);
    expect(button.getText()).toEqual(text);
    expect(button.getType()).toEqual(type);
    expect(button.getPosition()).toEqual(position);
    expect(button.getCallback()).toEqual(callback);
  });
});
