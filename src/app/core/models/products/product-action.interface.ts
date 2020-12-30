import { Product } from '@core/models/products';
import { ButtonAction } from './button-action.enum';

export interface ProductAction {
  action: ButtonAction;
  product: Product;
}
