import { cloneDeep } from 'lodash';
import { Product } from '@core/models/products';

const productPropertiesToRecalculate: string[] = [
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
      (recalculatedObject[key] = convertToPrecision(
        multipleBy(object[key], share)
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
