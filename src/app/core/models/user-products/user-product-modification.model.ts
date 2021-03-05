import { UserProductDTO } from './user-product-dto.model';

export interface UserProductModification {
  userId: number;
  product: UserProductDTO;
}
