import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { AuthService } from "../../../features/authentication/services/auth.service";
import { UserRole } from "../../../features/authentication/models/user-roles.model";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as UserRole[];
    const userRole = this.auth.getUserRole();

    if (!userRole || !expectedRoles.includes(userRole)) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}