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
