import { Content } from './content';
import { Footer } from './footer';
import { Header } from './header';
import { ModalConfiguration } from './modal-configuration';
import { ModalPriority } from './modal-priority.enum';

describe('ModalConfiguration', () => {
  it('should create empty instance', () => {
    expect(new ModalConfiguration()).toBeTruthy();
  });

  it('should create full instance', () => {
    const modalConfig = new ModalConfiguration();
    const id = 'modalId';
    const header = new Header();
    const content = new Content();
    const footer = new Footer();
    const priority = ModalPriority.HIGH;

    modalConfig.setId(id);
    modalConfig.setHeader(header);
    modalConfig.setContent(content);
    modalConfig.setFooter(footer);
    modalConfig.setPriority(priority);

    expect(modalConfig.getId()).toEqual(id);
    expect(modalConfig.getHeader()).toEqual(header);
    expect(modalConfig.getContent()).toEqual(content);
    expect(modalConfig.getFooter()).toEqual(footer);
    expect(modalConfig.getPriority()).toEqual(priority);
  });
});
