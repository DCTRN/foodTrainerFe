import { Button } from './button';

export class Footer {
  constructor(private buttons: Button[] = []) {}

  public setButtons(buttons: Button[]): void {
    this.buttons = buttons;
  }

  public addButton(button: Button): void {
    this.buttons.push(button);
  }

  public deleteButton(id: string): void {
    const index = this.buttons.findIndex(
      (button: Button) => button.getId() === id
    );
    if (index === -1) {
      return;
    }
    this.buttons.splice(index, 1);
  }

  public clearFooter(): void {
    this.buttons = [];
  }

  public getButtons(): Button[] {
    return this.buttons;
  }
}
