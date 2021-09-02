export enum Sex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export interface UserDetails {
  id?: number;
  age: number;
  height: number;
  weight: number;
  sex: Sex;
}
