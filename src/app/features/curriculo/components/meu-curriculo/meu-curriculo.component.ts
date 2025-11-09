import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurriculoService, CurriculoResumo, Curriculo } from '../../services/curriculo.service';
import { AuthService } from '../../../authentication/services/auth.service';

interface MeuCurriculoState {
  hasVinculo: boolean;
  isLoading: boolean;
  isSearching: boolean;
  isVinculando: boolean;
  isDesvinculando: boolean;
  curriculo: Curriculo | null;
  searchResults: CurriculoResumo[];
  searchTerm: string;
  userName: string;
  errorMessage: string;
  successMessage: string;
}

@Component({
  selector: 'app-meu-curriculo',
  templateUrl: './meu-curriculo.component.html',
  styleUrls: ['./meu-curriculo.component.scss'],
  standalone: false,
})
export class MeuCurriculoComponent implements OnInit {
  state: MeuCurriculoState = {
    hasVinculo: false,
    isLoading: true,
    isSearching: false,
    isVinculando: false,
    isDesvinculando: false,
    curriculo: null,
    searchResults: [],
    searchTerm: '',
    userName: '',
    errorMessage: '',
    successMessage: ''
  };

  constructor(
    private curriculoService: CurriculoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.state.userName = this.authService.getUserName() || '';
    this.state.searchTerm = this.state.userName;
    this.checkMeuCurriculo();
  }

  checkMeuCurriculo(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.state.errorMessage = 'Usuário não autenticado';
      this.state.isLoading = false;
      return;
    }

    this.state.isLoading = true;
    this.clearMessages();

    // Verifica se o usuário tem um currículo vinculado (armazenado no localStorage)
    const idMeuCurriculo = localStorage.getItem('idMeuCurriculo');
    if (idMeuCurriculo) {
      try {
        this.curriculoService.getCurriculoById(idMeuCurriculo).subscribe({
          next: (response) => {
            if (response && response.success && response.data) {
              // Usuário já tem um currículo vinculado - redireciona para visualização completa
              this.router.navigate(['/curriculo/view', idMeuCurriculo]);
            } else {
              // Currículo não encontrado, resetar vínculo
              this.state.hasVinculo = false;
              localStorage.removeItem('idMeuCurriculo');
            }
            this.state.isLoading = false;
          },
          error: (error) => {
            console.error('Erro ao carregar meu currículo:', error);
            this.state.hasVinculo = false;
            this.state.isLoading = false;
            
            // Se o erro for de não encontrado (404), remove do localStorage
            if (error.status === 404) {
              localStorage.removeItem('idMeuCurriculo');
            } else {
              this.handleAuthError(error);
            }
          }
        });
      } catch (error) {
        this.handleValidationError(error);
      }
    } else {
      // Usuário não tem currículo vinculado
      this.state.hasVinculo = false;
      this.state.isLoading = false;
    }
  }

  onSearch(): void {
    if (!this.state.searchTerm.trim()) {
      this.state.errorMessage = 'Digite um nome para buscar';
      return;
    }

    this.state.isSearching = true;
    this.clearMessages();

    try {
      this.curriculoService.buscarCurriculoPorNome(this.state.searchTerm).subscribe({
        next: (response) => {
          if (response && response.success && response.data && response.data.length > 0) {
            this.state.searchResults = response.data;
            this.state.successMessage = `Encontrados ${response.data.length} currículos`;
          } else {
            this.state.searchResults = [];
            this.state.errorMessage = 'Nenhum currículo encontrado com esse nome. Verifique se o nome está correto ou se o currículo está cadastrado na plataforma.';
          }
          this.state.isSearching = false;
        },
        error: (error) => {
          console.error('Erro na busca:', error);
          this.state.searchResults = [];
          this.state.errorMessage = 'Erro ao buscar currículos. Tente novamente.';
          this.state.isSearching = false;
        }
      });
    } catch (error) {
      this.handleValidationError(error);
      this.state.isSearching = false;
    }
  }

  onVincularCurriculo(curriculoId: string): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.state.errorMessage = 'Usuário não autenticado';
      return;
    }

    this.state.isVinculando = true;
    this.clearMessages();

    try {
      this.curriculoService.vincularMeuCurriculo(userId, curriculoId).subscribe({
        next: (response) => {
          if (response && response.success) {
            this.state.successMessage = 'Currículo vinculado com sucesso!';
            this.state.searchResults = [];
            this.state.searchTerm = this.state.userName;
            
            // Salva o ID do currículo vinculado no localStorage
            localStorage.setItem('idMeuCurriculo', curriculoId);
            
            // Redireciona para a visualização completa do currículo
            setTimeout(() => {
              this.router.navigate(['/curriculo/view', curriculoId]);
            }, 1500);
          } else {
            this.state.errorMessage = response?.message || 'Erro ao vincular currículo';
          }
          this.state.isVinculando = false;
        },
        error: (error) => {
          console.error('Erro ao vincular currículo:', error);
          this.state.errorMessage = 'Erro ao vincular currículo. Tente novamente.';
          this.state.isVinculando = false;
          this.handleAuthError(error);
        }
      });
    } catch (error) {
      this.handleValidationError(error);
      this.state.isVinculando = false;
    }
  }

  onDesvincularCurriculo(): void {
    if (!confirm('Tem certeza que deseja desvincular este currículo? Você poderá vincular outro currículo depois.')) {
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      this.state.errorMessage = 'Usuário não autenticado';
      return;
    }

    this.state.isDesvinculando = true;
    this.clearMessages();

    try {
      this.curriculoService.desvincularMeuCurriculo(userId).subscribe({
        next: (response) => {
          if (response && response.success) {
            this.state.successMessage = 'Currículo desvinculado com sucesso!';
            this.state.hasVinculo = false;
            this.state.curriculo = null;
            this.state.searchTerm = this.state.userName;
            
            // Remove o ID do currículo vinculado do localStorage
            localStorage.removeItem('idMeuCurriculo');
          } else {
            this.state.errorMessage = response?.message || 'Erro ao desvincular currículo';
          }
          this.state.isDesvinculando = false;
        },
        error: (error) => {
          console.error('Erro ao desvincular currículo:', error);
          this.state.errorMessage = 'Erro ao desvincular currículo. Tente novamente.';
          this.state.isDesvinculando = false;
          this.handleAuthError(error);
        }
      });
    } catch (error) {
      this.handleValidationError(error);
      this.state.isDesvinculando = false;
    }
  }

  onViewCurriculo(curriculoId: string): void {
    this.router.navigate(['/curriculo/view', curriculoId]);
  }

  clearSearch(): void {
    this.state.searchResults = [];
    this.state.searchTerm = this.state.userName;
    this.clearMessages();
  }

  private clearMessages(): void {
    this.state.errorMessage = '';
    this.state.successMessage = '';
  }

  private handleAuthError(error: any): void {
    if (error.message && error.message.includes('não autenticado')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  private handleValidationError(error: any): void {
    console.error('Erro de validação:', error);
    this.state.isLoading = false;
    this.state.isSearching = false;
    
    if (error instanceof Error && error.message.includes('não autenticado')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    } else {
      this.state.errorMessage = 'Erro de validação. Tente novamente.';
    }
  }

  trackByCurriculoId(index: number, curriculo: CurriculoResumo): string {
    return curriculo.id;
  }
}