export interface RoutePaths {
  login: string;
  register: string;
  home: string;
  wildcard: string;
}

export const ROUTE_PATHS: RoutePaths = {
  login: 'login',
  register: 'register',
  home: 'home',
  wildcard: '**',
};
