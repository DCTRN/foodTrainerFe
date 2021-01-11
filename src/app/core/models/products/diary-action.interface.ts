import { UserProduct } from '../user-products';
import { ButtonAction } from './button-action.enum';

export interface DiaryAction {
  action: ButtonAction;
  userProduct: UserProduct;
}
