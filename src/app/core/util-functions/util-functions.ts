import { Product } from '@core/models/products';
import { ProductMacroNutritions } from '@core/models/products/product-macro-nutritions.interface';
import { ProductNutritions } from '@core/models/products/product-nutritions.interface';
import { UserProduct } from '@core/models/user-products/user-product.model';
import { UserNutritionGoals } from '@core/stores/user/user-nutrition-goals.model';
import { cloneDeep } from 'lodash';

export const percentConstant = 100;
export const fatsKcalPerUnit = 9;
export const carbsKcalPerUnit = 4;
export const proteinsKcalPerUnit = 4;

export const productPropertiesToRecalculate: string[] = [
  'kcal',
  'protein',
  'carbohydrates',
  'fats',
];

export function convertToPrecision(
  number: number,
  precision: number = 2
): number {
  return Number(number.toFixed(precision));
}

export function multipleBy(number: number, multiplier: number): number {
  return number * multiplier;
}

export function subtractBy(number: number, substract: number): number {
  return number / substract;
}

export function castString(value: any): string {
  return String(value);
}

export function trim(value: any): string {
  return castString(value).trim();
}

export function removeDuplicatesById<T extends { id: number }>(
  array: T[]
): T[] {
  return array.filter(
    (product, index, arr) => arr.findIndex((p) => p.id === product.id) === index
  );
}

export function createUserProductsNutritions(
  userProducts: Array<UserProduct>
): Array<ProductNutritions> {
  return userProducts.map((up: UserProduct) =>
    createNutritions(calculateProductValues(up.amount, up.product))
  );
}

export function createNutritions(product: Product): ProductNutritions {
  return {
    kcal: product.kcal | 0,
    protein: product.protein | 0,
    carbohydrates: product.carbohydrates | 0,
    fats: product.fats | 0,
  };
}

export function reduceUserProductsNutritions(
  userProducts: Array<UserProduct>
): ProductNutritions {
  const targetProductValues: ProductNutritions = {
    kcal: 0,
    protein: 0,
    carbohydrates: 0,
    fats: 0,
  };
  userProducts.forEach((up: UserProduct) =>
    addValuesOfProduct(
      targetProductValues,
      calculateProductValues(up.amount, up.product)
    )
  );
  return targetProductValues;
}

export function addValuesOfProduct(
  origin: Partial<Product>,
  current: Partial<Product>
): Partial<Product> {
  return addValuesOfObjectsByKeys<Partial<Product>>(
    origin,
    current,
    productPropertiesToRecalculate
  );
}

export function addValuesOfObjectsByKeys<T>(
  origin: T,
  current: T,
  keys: string[]
): T {
  keys.forEach((key: string) => (origin[key] += current[key]));
  return origin;
}

export function calculateProductValues(
  amount: number,
  product: Product
): Product {
  return calculateProperties(
    calculateShare(amount, product.amount),
    product,
    productPropertiesToRecalculate
  );
}

export function calculateProperties<T>(
  share: number,
  object: T,
  keys: string[]
): T {
  const recalculatedObject: T = cloneDeep(object);
  keys.forEach(
    (key: string) =>
      (recalculatedObject[key] = Math.trunc(
        convertToPrecision(multipleBy(object[key], share))
      ))
  );
  return recalculatedObject;
}

export function calculateShare(
  currentAmout: number,
  wholeAmount: number,
  precision: number = 2
): number {
  return convertToPrecision(subtractBy(currentAmout, wholeAmount), precision);
}

export function incrementDateByDay(date: Date): Date {
  if (!date) {
    return new Date();
  }
  return new Date(date.getTime() + day);
}

const day = 1000 * 60 * 60 * 24;
export function decrementDateByDay(date: Date): Date {
  if (!date) {
    return new Date();
  }
  return new Date(date.getTime() - day);
}

export function addOneDay(date: Date): Date {
  if (!date) {
    return new Date();
  }
  return new Date(date.getTime() - day);
}

export function setBeginningOfTheDay(date: Date): Date {
  date.setHours(0, 0, 0);
  return date;
}

export function setEndOfTheDay(date: Date): Date {
  date.setHours(23, 59, 59);
  return date;
}

export function calculateFats(kcal: number, percentage: number): number {
  return Math.trunc(((percentage / percentConstant) * kcal) / fatsKcalPerUnit);
}

export function calculateCarbs(kcal: number, percentage: number): number {
  return Math.trunc(((percentage / percentConstant) * kcal) / carbsKcalPerUnit);
}

export function calculateProtein(kcal: number, percentage: number): number {
  return Math.trunc(
    ((percentage / percentConstant) * kcal) / proteinsKcalPerUnit
  );
}

export function calculateProductMacroNutritions(
  userNutritionGoals: UserNutritionGoals
): ProductMacroNutritions {
  return {
    protein: calculateProtein(
      userNutritionGoals.kcal,
      userNutritionGoals.protein
    ),
    carbohydrates: calculateCarbs(
      userNutritionGoals.kcal,
      userNutritionGoals.carbs
    ),
    fats: calculateFats(userNutritionGoals.kcal, userNutritionGoals.fats),
  };
}

export function calculateProductMacroNutritionsPerPeriod(
  userNutritionGoals: UserNutritionGoals,
  period: number
): ProductMacroNutritions {
  return {
    protein: Math.trunc(
      calculateProtein(userNutritionGoals.kcal, userNutritionGoals.protein) *
        period
    ),
    carbohydrates: Math.trunc(
      calculateCarbs(userNutritionGoals.kcal, userNutritionGoals.carbs) * period
    ),
    fats: Math.trunc(
      calculateFats(userNutritionGoals.kcal, userNutritionGoals.fats) * period
    ),
  };
}
