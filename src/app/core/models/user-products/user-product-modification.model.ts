import { UserProduct } from './user-product.model';

export interface UserProductModification {
  userId: number;
  product: UserProduct;
}
