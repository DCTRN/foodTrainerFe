import { Header } from './header';
import { HeaderColor } from './header-color.enum';
import { Icon } from './icon.enum';

describe('Header', () => {
  it('should create empty instance', () => {
    expect(new Header()).toBeTruthy();
  });

  it('should test header methods', () => {
    const header = new Header();
    const title = 'title1';
    const color = HeaderColor.RED_HEADER;
    const icon = Icon.ERROR;

    header.setTitle(title);
    header.setColor(color);
    header.setIcon(icon);

    expect(header.getTitle()).toEqual(title);
    expect(header.getColor()).toEqual(color);
    expect(header.getIcon()).toEqual(icon);
  });
});
