export class Content {
  constructor(private text: string[] = []) {}

  public setText(text: string[]): void {
    this.text = text;
  }

  public addText(text: string): void {
    this.text.push(text);
  }

  public deleteText(text: string): void {
    const index = this.text.indexOf(text);
    if (index === -1) {
      return;
    }
    this.text.splice(index, 1);
  }

  public clearContent(): void {
    this.text = [];
  }

  public getText(): string[] {
    return this.text;
  }
}
