import { Component } from '@angular/core';
import { ROUTE_PATHS } from '../../../app.paths';
 import { AuthService } from '../../authentication/services/auth.service';
 

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  protected readonly ROUTE_PATHS = ROUTE_PATHS;

  constructor(
    private readonly authService: AuthService,
  ) {}

  onLogout(): void {
    // this.curriculoService.logout();
  }
  onLogout(): void {
    this.authService.logout();
  }
}
