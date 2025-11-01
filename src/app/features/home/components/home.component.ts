import { Component } from '@angular/core';
import { ROUTE_PATHS } from '../../../app.paths';
import { AuthService } from '../../authentication/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  protected readonly ROUTE_PATHS = ROUTE_PATHS;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {}

  Pesquisar(): void {
    // this.curriculoService.pesquisar();
  }
  onLogout(): void {
    this.authService.logout();
  }
}
