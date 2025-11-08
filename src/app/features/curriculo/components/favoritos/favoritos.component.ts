import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurriculoResumo, CurriculoService } from '../../services/curriculo.service';
import { AuthService } from '../../../authentication/services/auth.service';
import { CurriculoListConfig } from '../curriculo-list-simple/curriculo-list-simple.component';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.scss'],
  standalone: false,
})
export class FavoritosComponent implements OnInit {
  favoritos: CurriculoResumo[] = [];
  isLoading = false;
  
  listConfig: CurriculoListConfig = {
    title: 'Currículos Favoritos',
    emptyMessage: 'Nenhum currículo nos favoritos',
    emptyIcon: '⭐',
    showRemoveButton: true,
    loadingMessage: 'Carregando favoritos...'
  };

  constructor(
    private router: Router,
    private curriculoService: CurriculoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadFavoritos();
  }

  loadFavoritos(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('Usuário não autenticado');
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    
    try {
      this.curriculoService.getFavoritos(userId).subscribe({
        next: (response) => {
          if (response && response.success && response.data && response.data.length > 0) {
            this.favoritos = response.data;
          } else {
            this.favoritos = [];
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar favoritos:', error);
          
          // Se o erro for de autenticação, redireciona para login
          if (error.message && error.message.includes('não autenticado')) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
          
          this.favoritos = [];
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Erro de validação:', error);
      this.favoritos = [];
      this.isLoading = false;
      
      // Se o erro for de autenticação, redireciona para login
      if (error instanceof Error && error.message.includes('não autenticado')) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    }
  }



  onViewCurriculo(curriculoId: string): void {
    this.router.navigate(['/curriculo', curriculoId]);
  }

  onRemoveFavorito(curriculoId: string): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('Usuário não autenticado');
      return;
    }

    try {
      this.curriculoService.removeFavorito(userId, curriculoId).subscribe({
        next: (response) => {
          if (response && response.success) {
            // Remove o currículo da lista local
            this.favoritos = this.favoritos.filter(f => f.id !== curriculoId);
            console.log('Currículo removido dos favoritos');
          } else {
            console.error('Erro ao remover dos favoritos:', response?.message || 'Resposta inválida');
          }
        },
        error: (error) => {
          console.error('Erro ao remover dos favoritos:', error);
          
          // Se o erro for de autenticação, redireciona para login
          if (error.message && error.message.includes('não autenticado')) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      });
    } catch (error) {
      console.error('Erro de validação:', error);
      
      // Se o erro for de autenticação, redireciona para login
      if (error instanceof Error && error.message.includes('não autenticado')) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    }
  }
}