import {
  product1,
  product2,
  product3,
  product4,
} from '@testsUT/products/products-mock-data.model';
import {
  MealEatTimeType,
  UserProduct,
  UserProductDeletion,
  UserProductDTO,
  UserProductModification,
  UserProductsByDate,
  UserProductsByDateRange,
} from '../../../src/app/core/models/user-products';

export const addUserProductDTO1: UserProductDTO = {
  productId: 1,
  amount: 222,
  date: new Date('2020-12-20T23:18:01.443Z'),
  mealTimeType: MealEatTimeType.LUNCH,
  userId: 1,
};

export const userProductDTO1: UserProductDTO = {
  id: 1,
  productId: 1,
  amount: 111,
  date: new Date('2020-12-20T23:18:01.443Z'),
  mealTimeType: MealEatTimeType.LUNCH,
  userId: 1,
};
export const userProductDTO2: UserProductDTO = {
  id: 2,
  productId: 2,
  amount: 222,
  date: new Date('2020-12-20T23:18:01.443Z'),
  mealTimeType: MealEatTimeType.BREAKFAST,
  userId: 1,
};
export const userProductDTO3: UserProductDTO = {
  id: 3,
  productId: 3,
  amount: 333,
  date: new Date('2020-12-20T23:18:01.443Z'),
  mealTimeType: MealEatTimeType.DINNER,
  userId: 1,
};
export const userProductDTO4: UserProductDTO = {
  id: 4,
  productId: 4,
  amount: 444,
  date: new Date('2020-12-20T23:18:01.443Z'),
  mealTimeType: MealEatTimeType.OTHERS,
  userId: 1,
};

export const userProduct1: UserProduct = {
  id: 1,
  product: product1,
  amount: 111,
  date: new Date('2020-12-20T23:18:01.443Z'),
  mealTimeType: MealEatTimeType.LUNCH,
  userId: 1,
};
export const userProduct2: UserProduct = {
  id: 2,
  product: product2,
  amount: 222,
  date: new Date('2020-12-20T23:18:01.443Z'),
  mealTimeType: MealEatTimeType.BREAKFAST,
  userId: 1,
};
export const userProduct3: UserProduct = {
  id: 3,
  product: product3,
  amount: 333,
  date: new Date('2020-12-20T23:18:01.443Z'),
  mealTimeType: MealEatTimeType.DINNER,
  userId: 1,
};
export const userProduct4: UserProduct = {
  id: 4,
  product: product4,
  amount: 444,
  date: new Date('2020-12-20T23:18:01.443Z'),
  mealTimeType: MealEatTimeType.OTHERS,
  userId: 1,
};

export const userProduct5: UserProduct = {
  id: 4,
  product: product4,
  amount: 100,
  date: new Date('2020-12-20T23:18:01.443Z'),
  mealTimeType: MealEatTimeType.BREAKFAST,
  userId: 1,
};

export const updateUserProduct1: UserProductModification = {
  userId: 1,
  product: userProductDTO1,
};

export const userProductDeletion: UserProductDeletion = {
  userId: 1,
  userProductId: 1,
};

export const userProductByDate: UserProductsByDate = {
  userId: 1,
  date: new Date('2020-12-20T23:18:01.443Z'),
};

export const userProductByDateRange: UserProductsByDateRange = {
  userId: 1,
  start: new Date('2020-12-20T23:18:01.443Z'),
  end: new Date('2020-12-21T23:18:01.443Z'),
};
