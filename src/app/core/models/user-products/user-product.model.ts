import { MealEatTimeType } from './meal-eat-time-type.enum';

export interface UserProduct {
  id?: number;
  productId: number;
  amount: number;
  date: Date;
  mealTimeType: MealEatTimeType;
  userId: number;
}
