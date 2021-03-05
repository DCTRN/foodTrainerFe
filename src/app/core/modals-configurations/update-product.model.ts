import { ModalService } from '@core/modal-service/modal.service';
import { Button } from '@core/modal-service/models/button';
import { ButtonPosition } from '@core/modal-service/models/button-position.enum';
import { ButtonType } from '@core/modal-service/models/button-type.enum';
import { Content } from '@core/modal-service/models/content';
import { Footer } from '@core/modal-service/models/footer';
import { Header } from '@core/modal-service/models/header';
import { HeaderColor } from '@core/modal-service/models/header-color.enum';
import { Icon } from '@core/modal-service/models/icon.enum';
import { ModalConfiguration } from '@core/modal-service/models/modal-configuration';

export class UpdateProductModalConfiguration extends ModalConfiguration {
  public readonly updateProductId = 'update-product-modal';
  public readonly updateProductTitle = 'Update product warrning';
  public readonly updateProductBtnId = 'update-product';

  public modalHeader = new Header()
    .setTitle(this.updateProductTitle)
    .setIcon(Icon.WARNING)
    .setColor(HeaderColor.YELLOW_HEADER);

  public modalContent = new Content([
    'You are about to update product.',
    'This action will affect other users.',
    '',
    'Do you want to proceed?',
  ]);

  public closeButton = new Button()
    .setText('Close')
    .setCallback(() => this.modalService.closeDialog(this.updateProductId))
    .setType(ButtonType.SECONDARY)
    .setPosition(ButtonPosition.LEFT);

  public updateProductButton = new Button()
    .setId(this.updateProductBtnId)
    .setText('Update product')
    .setPosition(ButtonPosition.RIGHT);

  public modalFooter = new Footer()
    .addButton(this.closeButton)
    .addButton(this.updateProductButton);

  constructor(private modalService: ModalService) {
    super();
    this.setId(this.updateProductId);
    this.setHeader(this.modalHeader);
    this.setContent(this.modalContent);
    this.setFooter(this.modalFooter);
  }
}
