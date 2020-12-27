enum AuthUrl {
  AUTH = 'auth',
  REGISTER = 'auth/register',
  LOGIN = 'auth/login',
  REFRESH = 'auth/refresh',
}

enum UsersUrl {
  USERS = 'users',
  USER_FRIENDS = 'userFriends',
}

enum ProductsUrl {
  PRODUCT = 'product',
}

enum UserProductsUrl {
  USER_PRODUCT = 'userProduct',
  FIND_USER_PRODUCT_BY_BATE = 'userProduct/findByDate',
  FIND_USER_PRODUCT_BY_BATE_RANGE = 'userProduct/findByDateRange',
}

export abstract class Environment {
  public static readonly apiUrl = 'http://localhost:4000/';
  public static readonly authUrl = AuthUrl;
  public static readonly userUrl = UsersUrl;
  public static readonly productsUrl = ProductsUrl;
  public static readonly userProductsUrl = UserProductsUrl;
}
