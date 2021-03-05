import { MealEatTimeType } from './meal-eat-time-type.enum';

export interface UserProductDTO {
  id?: number;
  productId: number;
  amount: number;
  date: Date;
  mealTimeType: MealEatTimeType;
  userId: number;
}
