import { Content } from './content';
import { Footer } from './footer';
import { Header } from './header';
import { ModalPriority } from './modal-priority.enum';

export class ModalConfiguration {
  constructor(
    private id?: string,
    private priority?: ModalPriority,
    private header: Header = new Header(),
    private content: Content = new Content(),
    private footer: Footer = new Footer()
  ) {}

  public setId(id: string): ModalConfiguration {
    this.id = id;
    return this;
  }

  public setPriority(priority: ModalPriority): ModalConfiguration {
    this.priority = priority;
    return this;
  }

  public setHeader(header: Header): ModalConfiguration {
    this.header = header;
    return this;
  }

  public setContent(content: Content): ModalConfiguration {
    this.content = content;
    return this;
  }

  public setFooter(footer: Footer): ModalConfiguration {
    this.footer = footer;
    return this;
  }

  public getId(): string {
    return this.id;
  }

  public getPriority(): ModalPriority {
    return this.priority;
  }

  public getHeader(): Header {
    return this.header;
  }

  public getContent(): Content {
    return this.content;
  }

  public getFooter(): Footer {
    return this.footer;
  }
}
