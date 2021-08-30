export enum Sex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export interface UserDetails {
  age: number;
  height: number;
  weight: number;
  sex: Sex;
}
