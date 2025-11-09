import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurriculoResumo, CurriculoService } from '../../services/curriculo.service';
import { AuthService } from '../../../authentication/services/auth.service';
import { CurriculoListConfig } from '../curriculo-list-simple/curriculo-list-simple.component';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.scss'],
  standalone: false,
})
export class HistoricoComponent implements OnInit {
  historico: CurriculoResumo[] = [];
  isLoading = false;
  
  listConfig: CurriculoListConfig = {
    title: 'Histórico de Visualizações',
    emptyMessage: 'Nenhum currículo visualizado recentemente',
    emptyIcon: '🕒',
    showRemoveButton: true,
    loadingMessage: 'Carregando histórico...'
  };

  constructor(
    private router: Router,
    private curriculoService: CurriculoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadHistorico();
  }

  loadHistorico(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('Usuário não autenticado');
      this.isLoading = false;
      return;
    }

    this.isLoading = true;

    try {
      this.curriculoService.getHistorico(userId).subscribe({
        next: (response) => {
          if (response && response.success && response.data) {
            this.historico = response.data;
          } else {
            console.error('Erro na resposta do histórico:', response?.message);
            this.historico = [];
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar histórico:', error);
          this.historico = [];
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Erro de validação ao carregar histórico:', error);
      this.historico = [];
      this.isLoading = false;
    }
  }



  // Método público para adicionar um currículo ao histórico (será chamado de outros componentes)
  static addToHistorico(curriculo: CurriculoResumo, curriculoService: CurriculoService, authService: AuthService): void {
    const userId = authService.getUserId();
    if (!userId) {
      console.error('Usuário não autenticado para adicionar ao histórico');
      return;
    }

    try {
      curriculoService.addToHistorico(userId, curriculo.id).subscribe({
        next: (response) => {
          if (response && response.success) {
            console.log('Currículo adicionado ao histórico com sucesso');
          } else {
            console.error('Erro ao adicionar ao histórico:', response?.message);
          }
        },
        error: (error) => {
          console.error('Erro ao adicionar ao histórico:', error);
        }
      });
    } catch (error) {
      console.error('Erro de validação ao adicionar ao histórico:', error);
    }
  }

  onViewCurriculo(curriculoId: string): void {
    this.router.navigate(['/curriculo', curriculoId]);
  }

  onRemoveFromHistorico(curriculoId: string): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('Usuário não autenticado');
      return;
    }

    try {
      this.curriculoService.removeFromHistorico(userId, curriculoId).subscribe({
        next: (response) => {
          if (response && response.success) {
            // Remove da lista local após sucesso no backend
            this.historico = this.historico.filter(h => h.id !== curriculoId);
            console.log('Currículo removido do histórico com sucesso');
          } else {
            console.error('Erro ao remover do histórico:', response?.message);
          }
        },
        error: (error) => {
          console.error('Erro ao remover do histórico:', error);
        }
      });
    } catch (error) {
      console.error('Erro de validação ao remover do histórico:', error);
    }
  }

  clearHistorico(): void {
    if (!confirm('Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.')) {
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('Usuário não autenticado');
      return;
    }

    try {
      this.curriculoService.clearHistorico(userId).subscribe({
        next: (response) => {
          if (response && response.success) {
            // Limpa a lista local após sucesso no backend
            this.historico = [];
            console.log('Histórico limpo com sucesso');
          } else {
            console.error('Erro ao limpar histórico:', response?.message);
          }
        },
        error: (error) => {
          console.error('Erro ao limpar histórico:', error);
        }
      });
    } catch (error) {
      console.error('Erro de validação ao limpar histórico:', error);
    }
  }
}