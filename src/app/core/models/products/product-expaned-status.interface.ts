import { Product } from '@core/models/products';

export interface ProductExpandStatus {
  product: Product;
  expanded: boolean;
}
