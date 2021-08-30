import {
  Product,
  ProductDeletion,
  ProductModification,
} from '@core/models/products';
import { User } from '@core/stores/user/user.model';
import { user1 } from '@testsUT/user/user-mock-data.model';

export const userInitial: User = user1;

export const productDeletion1: ProductDeletion = {
  userId: 1,
  productId: 1,
};

export const updateProduct1: Product = {
  producer: 'lidl',
  name: 'apple',
  unit: 'gram',
  amount: 100,
  kcal: 333,
  protein: 22,
  carbohydrates: 33,
  fats: 11,
  creatorId: 1,
};

export const productModification1: ProductModification = {
  userId: 1,
  product: updateProduct1,
};

export const addProduct1: Product = {
  producer: 'lidl',
  name: 'apple',
  unit: 'gram',
  amount: 100,
  kcal: 300,
  protein: 22,
  carbohydrates: 33,
  fats: 11,
  creatorId: 1,
};

export const product1: Product = {
  id: 1,
  producer: 'lidl',
  name: 'apple',
  unit: 'gram',
  amount: 100,
  kcal: 300,
  protein: 22,
  carbohydrates: 33,
  fats: 11,
  creatorId: 1,
};
export const product2: Product = {
  id: 2,
  producer: 'Aldi',
  name: 'mleko',
  unit: 'ml',
  amount: 100,
  kcal: 300,
  protein: 22,
  carbohydrates: 33,
  fats: 11,
  creatorId: 1,
};
export const product3: Product = {
  id: 3,
  producer: 'Auchan',
  name: 'kiwi',
  unit: 'gram',
  amount: 100,
  kcal: 300,
  protein: 22,
  carbohydrates: 33,
  fats: 11,
  creatorId: 1,
};
export const product4: Product = {
  id: 4,
  producer: 'Carrefour',
  name: 'Beer',
  unit: 'gram',
  amount: 100,
  kcal: 300,
  protein: 22,
  carbohydrates: 33,
  fats: 11,
  creatorId: 1,
};
export const product5: Product = {
  id: 5,
  producer: 'biedronka',
  name: 'apple',
  unit: 'gram',
  amount: 100,
  kcal: 300,
  protein: 22,
  carbohydrates: 33,
  fats: 11,
  creatorId: 1,
};
export const product6: Product = {
  id: 6,
  producer: 'biedronka',
  name: 'mleko',
  unit: 'ml',
  amount: 100,
  kcal: 300,
  protein: 22,
  carbohydrates: 33,
  fats: 11,
  creatorId: 1,
};
export const product7: Product = {
  id: 7,
  producer: 'biedronka',
  name: 'cukier',
  unit: 'gram',
  amount: 100,
  kcal: 300,
  protein: 22,
  carbohydrates: 33,
  fats: 11,
  creatorId: 1,
};
export const productsMock: Product[] = [product1, product2, product3];
