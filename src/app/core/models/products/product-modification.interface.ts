import { Product } from './product.interface';

export interface ProductModification {
  userId: number;
  product: Product;
}
