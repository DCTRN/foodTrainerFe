import { User } from '@stores/user/user.model';
import { LoginCredentials } from './login-credentials.model';
export const loginCredentialsMock: LoginCredentials = {
  username: 'mike8',
  password: 'haslo1234',
};
export const userMock: User = {
  username: 'mike8',
  password: 'haslo1234',
  email: 'michal.kowalski@gmail.com',
  phoneNumber: '123123123',
  birthDate: null,
  firstName: 'majkel',
  lastName: 'majk',
};
export const userFromBeMock: User = {
  username: 'mike8',
  email: 'michal.kowalski@gmail.com',
  birthDate: null,
  phoneNumber: '123123123',
  firstName: 'majkel',
  lastName: 'majk',
  id: 22,
  authenticationLevel: 1,
};
export const tokensMock = {
  access_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1pa2UxMjMiLCJwYXNzd29yZCI6Imhhc2xvMTIzNCIsImlhdCI6MTU5NzU4MTgyMywiZXhwIjoxNTk3NTgyMTIzfQ.9wAi_LmInRynGftD1Ql8FiYh5eB3DLcSFSXRzawTXKk',
  refresh_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1pa2UxMjMiLCJwYXNzd29yZCI6Imhhc2xvMTIzNCIsImlhdCI6MTU5NzU4MTgyMywiZXhwIjoxNjAwMTczODIzfQ.tT3JfnXm56Z-EnixMk4tmbfqRyAn2RGEjGyD7DDjUUg',
  expires_in: 300,
};
