import { Button } from './button';

export class Footer {
  constructor(private buttons: Button[] = []) {}

  public setButtons(buttons: Button[]): Footer {
    this.buttons = buttons;
    return this;
  }

  public addButton(button: Button): Footer {
    this.buttons.push(button);
    return this;
  }

  public deleteButton(id: string): Footer {
    const index = this.buttons.findIndex(
      (button: Button) => button.getId() === id
    );
    if (index === -1) {
      return this;
    }
    this.buttons.splice(index, 1);
    return this;
  }

  public clearFooter(): Footer {
    this.buttons = [];
    return this;
  }

  public getButtons(): Button[] {
    return this.buttons;
  }
}
