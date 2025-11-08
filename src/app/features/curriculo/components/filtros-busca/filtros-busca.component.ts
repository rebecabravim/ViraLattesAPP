import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FiltrosBusca } from '../../services/curriculo.service';
import { CountriesService } from '../../../shared/services/countries.service';

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
  
  availableYears: number[] = [];
  availableCountries: string[] = [];
  isDadosGeraisExpanded = true;
  nomeValue = '';
  assuntoValue = '';
  paisSelecionado = '';

  constructor(private countriesService: CountriesService) {
    this.availableYears = [];
    for (let year = this.currentYear; year >= 1943; year--) {
      this.availableYears.push(year);
    }
    this.availableCountries = this.countriesService.getCountryNames();
    this.filtros.ehBrasileiro = true;
    this.filtros.anoAPartirDe = '' as any;
  }

  toggleFilters(): void {
    this.isExpanded = !this.isExpanded;
  }

  toggleDadosGerais(): void {
    this.isDadosGeraisExpanded = !this.isDadosGeraisExpanded;
  }

  onCountryChange(): void {
    if (this.paisSelecionado) {
      this.filtros.ehBrasileiro = false;
    }
  }

  onBrasileiroChange(): void {
    if (this.filtros.ehBrasileiro) {
      this.paisSelecionado = '';
    }
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
    const filtrosLimpos: FiltrosBusca = {};
    if (this.nomeValue?.trim()) {
      filtrosLimpos.nome = this.nomeValue.trim();
    }
    
    if (this.assuntoValue?.trim()) {
      const assuntos = this.assuntoValue
        .split(',')
        .map((item: string) => item.trim())
        .filter((item: string) => item.length > 0);
      if (assuntos.length > 0) {
        filtrosLimpos.assuntos = assuntos;
      }
    }

    if (this.filtros.instituicao?.trim()) {
      filtrosLimpos.instituicao = this.filtros.instituicao.trim();
    }
    
    if (this.filtros.temDoutorado !== undefined) {
      filtrosLimpos.temDoutorado = this.filtros.temDoutorado;
    }

    if (this.filtros.anoAPartirDe && this.filtros.anoAPartirDe !== '' && Number(this.filtros.anoAPartirDe) > 0) {
      filtrosLimpos.anoAPartirDe = String(this.filtros.anoAPartirDe);
    }
    
    if (this.filtros.linhaDePesquisa?.trim()) {
      filtrosLimpos.linhaDePesquisa = this.filtros.linhaDePesquisa.trim();
    }
    
    if (this.filtros.areaDePesquisa?.trim()) {
      filtrosLimpos.areaDePesquisa = this.filtros.areaDePesquisa.trim();
    }
    
    if (this.paisSelecionado?.trim()) {
      filtrosLimpos.paisDeNacionalidade = this.paisSelecionado;
      filtrosLimpos.ehBrasileiro = null;
    } else {
      if (this.filtros.ehBrasileiro !== undefined) {
        filtrosLimpos.ehBrasileiro = null;
      }
    }
    
    if (this.filtros.palavrasChave && this.filtros.palavrasChave.length > 0) {
      filtrosLimpos.palavrasChave = this.filtros.palavrasChave;
    }

    this.filtrosChanged.emit(filtrosLimpos);
  }

  onClearFilters(): void {
    this.filtros = {};
    this.palavrasChaveText = '';
    this.nomeValue = ''; 
    this.assuntoValue = '';  
    this.filtros.ehBrasileiro = true;  
    this.filtros.anoAPartirDe = '' as any;  
    this.paisSelecionado = '';  
    this.filtrosCleared.emit();
  }

  setFiltros(filtros: FiltrosBusca): void {
    this.filtros = { ...filtros };
    if (filtros.palavrasChave && filtros.palavrasChave.length > 0) {
      this.palavrasChaveText = filtros.palavrasChave.join(', ');
    }
  }

  hasActiveFilters(): boolean {
    return !!(
      this.nomeValue?.trim() || 
      this.assuntoValue?.trim() || 
      this.filtros.instituicao?.trim() ||
      this.filtros.temDoutorado !== undefined ||
      (this.filtros.anoAPartirDe && String(this.filtros.anoAPartirDe) !== '') ||
      this.filtros.linhaDePesquisa?.trim() ||
      this.filtros.areaDePesquisa?.trim() ||
      this.filtros.ehBrasileiro === false ||
      this.paisSelecionado?.trim() ||
      (this.filtros.palavrasChave && this.filtros.palavrasChave.length > 0)
    );
  }
}