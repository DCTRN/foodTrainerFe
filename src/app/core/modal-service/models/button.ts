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

  public setId(id: string): void {
    this.id = id;
  }

  public setText(text: string): void {
    this.text = text;
  }

  public setCallback(callback: () => void): void {
    this.callback = callback;
  }

  public setType(type: ButtonType): void {
    this.type = type;
  }

  public setPosition(position: ButtonPosition): void {
    this.position = position;
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
