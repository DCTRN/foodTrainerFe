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
}
