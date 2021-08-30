import { Sex, UserDetails } from '@core/stores/user/user-details.model';
import { UserNutritionGoals } from '@core/stores/user/user-nutrition-goals.model';
import { UserActionType } from '@core/stores/user/user.actions';
import { User } from '@core/stores/user/user.model';
import { UserFromForm, UserFromFormTyped } from '@itf/user-utility-types.model';

export const user1Details: UserDetails = {
  age: 30,
  height: 180,
  weight: 75,
  sex: Sex.MALE,
};

export const undefinedUserDetails: UserDetails = {
  age: undefined,
  height: undefined,
  weight: undefined,
  sex: undefined,
};

export const user1NutritionGoals: UserNutritionGoals = {
  kcal: 3000,
  protein: 25,
  carbs: 50,
  fats: 25,
};

export const undefinedUserNutritionGoals: UserNutritionGoals = {
  kcal: undefined,
  protein: undefined,
  carbs: undefined,
  fats: undefined,
};

export const undefinedUser: User = {
  id: undefined,
  username: undefined,
  email: undefined,
  birthDate: undefined,
  phoneNumber: undefined,
  firstName: undefined,
  lastName: undefined,
  authenticationLevel: undefined,
  details: undefinedUserDetails,
  nutritionGoals: undefinedUserNutritionGoals,
};

export const nullUser: User = {
  id: null,
  username: null,
  email: null,
  birthDate: null,
  phoneNumber: null,
  firstName: null,
  lastName: null,
  authenticationLevel: null,
  details: null,
  nutritionGoals: null,
};

export const user1: User = {
  id: 1,
  username: 'mike',
  email: 'mike@gmail.com',
  birthDate: new Date(),
  phoneNumber: '223153146',
  firstName: 'majkel',
  lastName: 'majk',
  authenticationLevel: 1,
  details: user1Details,
  nutritionGoals: user1NutritionGoals,
};

export const user2: User = {
  id: 2,
  username: 'mike2',
  email: 'mike2@gmail.com',
  birthDate: null,
  phoneNumber: '223123146',
  firstName: 'majkel',
  lastName: 'majk',
  authenticationLevel: 1,
  details: user1Details,
  nutritionGoals: user1NutritionGoals,
};

export const user3: User = {
  id: 3,
  username: 'mike3',
  email: 'mike3@gmail.com',
  birthDate: null,
  phoneNumber: '220123146',
  firstName: 'majkel',
  lastName: 'majk',
  authenticationLevel: 1,
  details: user1Details,
  nutritionGoals: user1NutritionGoals,
};

export const user4: User = {
  id: 4,
  username: 'mike4',
  email: 'mike4@gmail.com',
  birthDate: null,
  phoneNumber: '220123146',
  firstName: 'majkel',
  lastName: 'majk',
  authenticationLevel: 1,
  details: user1Details,
  nutritionGoals: user1NutritionGoals,
};

export const user5: User = {
  id: 5,
  username: 'mike5',
  email: 'mike5@gmail.com',
  birthDate: null,
  phoneNumber: '220123146',
  firstName: 'majkel',
  lastName: 'majk',
  authenticationLevel: 1,
  details: user1Details,
  nutritionGoals: user1NutritionGoals,
};

export const userFromForm: UserFromForm = {
  id: 6,
  username: 'mike6',
  email: 'mike6@gmail.com',
  birthDate: null,
  phoneNumber: '210123146',
  firstName: 'mike6',
  lastName: 'mike6',
  authenticationLevel: 1,
  details: user1Details,
};

export const userFromRegisterFormWithType: UserFromFormTyped = {
  type: UserActionType.REGISTER_REQUEST,
  id: 6,
  username: 'mike6',
  email: 'mike6@gmail.com',
  birthDate: null,
  phoneNumber: '210123146',
  firstName: 'mike6',
  lastName: 'mike6',
  authenticationLevel: 1,
  details: user1Details,
};
