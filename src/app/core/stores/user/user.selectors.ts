import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { User } from './user.model';

export const userKey = 'user';

export const selectUserState = createFeatureSelector<AppState, User>(userKey);

export const selectUserNutritionGoals = createSelector(
  selectUserState,
  (state: User) => state.nutritionGoals
);
