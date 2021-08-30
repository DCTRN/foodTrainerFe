import { UserDetails } from './user-details.model';
import { UserNutritionGoals } from './user-nutrition-goals.model';

export interface User {
  id?: number;
  username: string;
  password?: string;
  email: string;
  birthDate: Date;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  authenticationLevel?: number;
  details: UserDetails;
  nutritionGoals: UserNutritionGoals;
}
