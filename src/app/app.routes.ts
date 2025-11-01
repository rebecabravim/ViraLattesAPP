import { Route } from '@angular/router';
import { ROUTE_PATHS } from './app.paths';
import { LoginComponent } from './features/authentication/components/login/login.component';
import { HomeComponent } from './features/home/components/home.component';
import { AuthGuard } from './core/guard/auth/auth.guard';

 
export const appRoutes: Route[] = [
  {
    path: ROUTE_PATHS.login,
    component: LoginComponent,
  },
  {
    path: ROUTE_PATHS.home,
    component: HomeComponent,
    canActivate: [AuthGuard],
  }, 
  {
    path: ROUTE_PATHS.wildcard,
    redirectTo: ROUTE_PATHS.home,
    pathMatch: 'full',
  },
];
