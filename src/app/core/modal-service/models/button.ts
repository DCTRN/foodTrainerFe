import { ButtonType } from './button-type.enum';
import { ButtonPosition } from './button-position.enum';

export class Button {
  constructor(
    private id?: string,
    private text?: string,
    private callback?: () => void,
    private type: ButtonType = ButtonType.PRIMARY,
    private position: ButtonPosition = ButtonPosition.RIGHT
  ) {}

  public setId(id: string): Button {
    this.id = id;
    return this;
  }

  public setText(text: string): Button {
    this.text = text;
    return this;
  }

  public setCallback(callback: () => void): Button {
    this.callback = callback;
    return this;
  }

  public setType(type: ButtonType): Button {
    this.type = type;
    return this;
  }

  public setPosition(position: ButtonPosition): Button {
    this.position = position;
    return this;
  }

  public getId(): string {
    return this.id;
  }

  public getText(): string {
    return this.text;
  }

  public getCallback(): () => void {
    return this.callback;
  }

  public getType(): ButtonType {
    return this.type;
  }

  public getPosition(): ButtonPosition {
    return this.position;
  }
}
