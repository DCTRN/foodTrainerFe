import { ProductNutritions } from './product-nutritions.interface';

export interface Product extends ProductNutritions {
  id?: number;
  producer: string;
  name: string;
  unit: string;
  amount: number;
  creatorId: number;
}
