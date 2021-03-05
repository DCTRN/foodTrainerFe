import { Icon } from './icon.enum';
import { HeaderColor } from './header-color.enum';

export class Header {
  constructor(
    private title?: string,
    private icon: Icon = Icon.INFO,
    private color: HeaderColor = HeaderColor.PURPLE_HEADER
  ) {}

  public setTitle(title: string): Header {
    this.title = title;
    return this;
  }

  public setIcon(icon: Icon): Header {
    this.icon = icon;
    return this;
  }

  public setColor(color: HeaderColor): Header {
    this.color = color;
    return this;
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
