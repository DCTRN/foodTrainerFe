import { ProductMacroNutritions } from './product-macro-nutritions.interface';

export interface ProductNutritions extends ProductMacroNutritions {
  kcal: number;
}
