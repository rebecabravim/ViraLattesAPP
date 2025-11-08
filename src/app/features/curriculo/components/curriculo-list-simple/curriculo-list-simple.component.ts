import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CurriculoResumo } from '../../services/curriculo.service';

export interface CurriculoListConfig {
  title: string;
  emptyMessage: string;
  emptyIcon: string;
  showRemoveButton?: boolean;
  showDateInfo?: boolean;
  loadingMessage?: string;
}

@Component({
  selector: 'app-curriculo-list-simple',
  templateUrl: './curriculo-list-simple.component.html',
  styleUrls: ['./curriculo-list-simple.component.scss'],
  standalone: false,
})
export class CurriculoListSimpleComponent {
  @Input() curriculos: CurriculoResumo[] = [];
  @Input() isLoading: boolean = false;
  @Input() config: CurriculoListConfig = {
    title: 'Lista de Currículos',
    emptyMessage: 'Nenhum currículo encontrado',
    emptyIcon: '📄',
    showRemoveButton: false,
    showDateInfo: false,
    loadingMessage: 'Carregando currículos...'
  };

  @Output() viewCurriculo = new EventEmitter<string>();
  @Output() removeCurriculo = new EventEmitter<string>();

  onView(curriculoId: string): void {
    this.viewCurriculo.emit(curriculoId);
  }

  onRemove(curriculoId: string): void {
    this.removeCurriculo.emit(curriculoId);
  }

  trackByCurriculoId(index: number, curriculo: CurriculoResumo): string {
    return curriculo.id;
  }
}