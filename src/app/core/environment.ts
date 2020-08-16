enum AuthUrl {
  AUTH = 'auth',
  REGISTER = 'auth/register',
  LOGIN = 'auth/login',
}

export abstract class Environment {
  public static apiUrl = 'http://localhost:4000/';
  public static authUrl = AuthUrl;
}
