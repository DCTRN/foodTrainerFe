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

export class DeleteProductModalConfiguration extends ModalConfiguration {
  public readonly deleteProductId = 'delete-product-modal';
  public readonly deleteProductTitle = 'Delete product warrning';
  public readonly deleteProductBtnId = 'delete-product';

  public modalHeader = new Header()
    .setTitle(this.deleteProductTitle)
    .setIcon(Icon.WARNING)
    .setColor(HeaderColor.RED_HEADER);

  public modalContent = new Content([
    'You are about to delete product.',
    'This action will affect other users.',
    '',
    'Do you want to proceed?',
  ]);

  public closeButton = new Button()
    .setText('Close')
    .setCallback(() => this.modalService.closeDialog(this.deleteProductId))
    .setType(ButtonType.SECONDARY)
    .setPosition(ButtonPosition.LEFT);

  public deleteProductButton = new Button()
    .setId(this.deleteProductBtnId)
    .setText('Delete product')
    .setPosition(ButtonPosition.RIGHT);

  public modalFooter = new Footer()
    .addButton(this.closeButton)
    .addButton(this.deleteProductButton);

  constructor(private modalService: ModalService) {
    super();
    this.setId(this.deleteProductId);
    this.setHeader(this.modalHeader);
    this.setContent(this.modalContent);
    this.setFooter(this.modalFooter);
  }
}
