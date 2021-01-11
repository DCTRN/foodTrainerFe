import { Product } from '../products';
import { MealEatTimeType } from './meal-eat-time-type.enum';

export interface UserProduct {
  id?: number;
  product: Product;
  amount: number;
  date: Date;
  mealTimeType: MealEatTimeType;
  userId: number;
}
