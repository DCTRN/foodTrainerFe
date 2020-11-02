import { Icon } from './icon.enum';
import { HeaderColor } from './header-color.enum';

export class Header {
  constructor(
    private title?: string,
    private icon: Icon = Icon.INFO,
    private color: HeaderColor = HeaderColor.PURPLE_HEADER
  ) {}

  public setTitle(title: string): void {
    this.title = title;
  }

  public setIcon(icon: Icon): void {
    this.icon = icon;
  }

  public setColor(color: HeaderColor): void {
    this.color = color;
  }

  public getTitle(): string {
    return this.title;
  }

  public getIcon(): Icon {
    return this.icon;
  }

  public getColor(): HeaderColor {
    return this.color;
  }
}
