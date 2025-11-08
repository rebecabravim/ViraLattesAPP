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
  searchTerm = '';

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

onSearch(): void {
    if (!this.searchTerm.trim()) {
      console.log('Termo de busca vazio');
      return;
    }

    // Navegar para a página de currículos com o termo de busca
    this.router.navigate([ROUTE_PATHS.curriculo], { 
      queryParams: { search: this.searchTerm.trim() } 
    });
  }

  navigateToCurriculos(): void {
    console.log('Navegando para currículos');
    this.router.navigate([ROUTE_PATHS.curriculo]);
  }

  onLogout(): void {
    this.authService.logout();
  }
}
