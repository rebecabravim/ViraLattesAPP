import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FiltrosBusca } from '../../services/curriculo.service';

@Component({
  selector: 'app-filtros-busca',
  templateUrl: './filtros-busca.component.html',
  styleUrls: ['./filtros-busca.component.scss'],
  standalone: false,
})
export class FiltrosBuscaComponent {
  @Input() isExpanded = false;
  @Output() filtrosChanged = new EventEmitter<FiltrosBusca>();
  @Output() filtrosCleared = new EventEmitter<void>();

  filtros: FiltrosBusca = {};
  palavrasChaveText = '';
  currentYear = new Date().getFullYear();

  constructor() {}

  toggleFilters(): void {
    this.isExpanded = !this.isExpanded;
  }

  updatePalavrasChave(): void {
    if (this.palavrasChaveText.trim()) {
      this.filtros.palavrasChave = this.palavrasChaveText
        .split(',')
        .map(palavra => palavra.trim())
        .filter(palavra => palavra.length > 0);
    } else {
      this.filtros.palavrasChave = [];
    }
  }

  removePalavraChave(index: number): void {
    if (this.filtros.palavrasChave) {
      this.filtros.palavrasChave.splice(index, 1);
      this.palavrasChaveText = this.filtros.palavrasChave.join(', ');
    }
  }

  onApplyFilters(): void {
    this.updatePalavrasChave();
    
    // Filtrar apenas campos com valores válidos
    const filtrosLimpos: FiltrosBusca = {};

    if (this.filtros.nome?.trim()) {
      filtrosLimpos.nome = this.filtros.nome.trim();
    }
    
    if (this.filtros.instituicao?.trim()) {
      filtrosLimpos.instituicao = this.filtros.instituicao.trim();
    }
    
    if (this.filtros.temDoutorado !== undefined) {
      filtrosLimpos.temDoutorado = this.filtros.temDoutorado;
    }
    
    if (this.filtros.anoAPartirDe && this.filtros.anoAPartirDe > 0) {
      filtrosLimpos.anoAPartirDe = this.filtros.anoAPartirDe;
    }
    
    if (this.filtros.linhaDePesquisa?.trim()) {
      filtrosLimpos.linhaDePesquisa = this.filtros.linhaDePesquisa.trim();
    }
    
    if (this.filtros.areaDePesquisa?.trim()) {
      filtrosLimpos.areaDePesquisa = this.filtros.areaDePesquisa.trim();
    }
    
    if (this.filtros.paisDeNacionalidade?.trim()) {
      filtrosLimpos.paisDeNacionalidade = this.filtros.paisDeNacionalidade.trim();
    }
    
    if (this.filtros.ehBrasileiro !== undefined) {
      filtrosLimpos.ehBrasileiro = this.filtros.ehBrasileiro;
    }
    
    if (this.filtros.palavrasChave && this.filtros.palavrasChave.length > 0) {
      filtrosLimpos.palavrasChave = this.filtros.palavrasChave;
    }

    this.filtrosChanged.emit(filtrosLimpos);
  }

  onClearFilters(): void {
    this.filtros = {};
    this.palavrasChaveText = '';
    this.filtrosCleared.emit();
  }

  // Método para definir filtros externamente (ex: quando vem da URL)
  setFiltros(filtros: FiltrosBusca): void {
    this.filtros = { ...filtros };
    if (filtros.palavrasChave && filtros.palavrasChave.length > 0) {
      this.palavrasChaveText = filtros.palavrasChave.join(', ');
    }
  }

  // Método para verificar se há filtros ativos
  hasActiveFilters(): boolean {
    return !!(
      this.filtros.nome?.trim() ||
      this.filtros.instituicao?.trim() ||
      this.filtros.temDoutorado !== undefined ||
      this.filtros.anoAPartirDe ||
      this.filtros.linhaDePesquisa?.trim() ||
      this.filtros.areaDePesquisa?.trim() ||
      this.filtros.paisDeNacionalidade?.trim() ||
      this.filtros.ehBrasileiro !== undefined ||
      (this.filtros.palavrasChave && this.filtros.palavrasChave.length > 0)
    );
  }
}