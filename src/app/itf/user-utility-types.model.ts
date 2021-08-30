import { UserNutritionGoals } from '@core/stores/user/user-nutrition-goals.model';
import { Action } from '@ngrx/store';
import { User } from '@stores/user/user.model';

export type UserFromForm = Omit<User, 'nutritionGoals'>;
export type UserFromFormTyped = UserFromForm & Action;

export const defaultNutritionGoals: UserNutritionGoals = {
  kcal: 2000,
  protein: 25,
  carbs: 50,
  fats: 25,
};
