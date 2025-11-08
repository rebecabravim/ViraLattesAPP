import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurriculoResumo } from '../../services/curriculo.service';
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

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadHistorico();
  }

  loadHistorico(): void {
    this.isLoading = true;
    
    const historicoData = this.getHistoricoFromStorage();
    this.historico = historicoData;
    this.isLoading = false;
  }

  private getHistoricoFromStorage(): CurriculoResumo[] {
    try {
      const stored = localStorage.getItem('curriculo-historico');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao carregar histórico do localStorage:', error);
      return [];
    }
  }

  private saveHistoricoToStorage(historico: CurriculoResumo[]): void {
    try {
      localStorage.setItem('curriculo-historico', JSON.stringify(historico));
    } catch (error) {
      console.error('Erro ao salvar histórico no localStorage:', error);
    }
  }

  // Método público para adicionar um currículo ao histórico (será chamado de outros componentes)
  static addToHistorico(curriculo: CurriculoResumo): void {
    try {
      const stored = localStorage.getItem('curriculo-historico');
      let historico: CurriculoResumo[] = stored ? JSON.parse(stored) : [];
      
      // Remove duplicatas (se já existe)
      historico = historico.filter(h => h.id !== curriculo.id);
      
      // Adiciona no início
      historico.unshift(curriculo);
      
      // Limita a 20 itens
      if (historico.length > 20) {
        historico = historico.slice(0, 20);
      }
      
      localStorage.setItem('curriculo-historico', JSON.stringify(historico));
    } catch (error) {
      console.error('Erro ao adicionar ao histórico:', error);
    }
  }

  onViewCurriculo(curriculoId: string): void {
    this.router.navigate(['/curriculo', curriculoId]);
  }

  onRemoveFromHistorico(curriculoId: string): void {
    this.historico = this.historico.filter(h => h.id !== curriculoId);
    this.saveHistoricoToStorage(this.historico);
  }

  clearHistorico(): void {
    this.historico = [];
    this.saveHistoricoToStorage([]);
  }
}