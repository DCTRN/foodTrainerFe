enum AuthUrl {
  AUTH = 'auth',
  REGISTER = 'auth/register',
  LOGIN = 'auth/login',
  REFRESH = 'auth/refresh',
}

enum UsersUrl {
  USERS = 'users',
}

export abstract class Environment {
  public static apiUrl = 'http://localhost:4000/';
  public static authUrl = AuthUrl;
  public static userUrl = UsersUrl;
}
