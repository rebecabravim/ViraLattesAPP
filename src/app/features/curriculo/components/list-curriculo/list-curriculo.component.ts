import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurriculoService, Curriculo, CurriculoResumo } from '../../services/curriculo.service';
import { CommonModule, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-list-curriculo',
  templateUrl: './list-curriculo.component.html',
  styleUrls: ['./list-curriculo-new.component.scss'],
  standalone: false,
})
export class ListCurriculoComponent implements OnInit {
  curriculos: CurriculoResumo[] = [];
  isLoading = true;
  searchTerm = '';
  filteredCurriculos: CurriculoResumo[] = [];
  totalCount = 0;

  constructor(
    private curriculoService: CurriculoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurriculos();
    console.log('ListCurriculoComponent initialized');
  }

  loadCurriculos(): void {
    this.isLoading = true;
    // Buscar todos os currículos (sem filtro)
    this.curriculoService.getAllCurriculos().subscribe({
      next: (response) => {
        if (response.success) {
          this.curriculos = response.data.data;
          this.filteredCurriculos = response.data.data;
          this.totalCount = response.data.count;
        } else {
          console.error('Erro na resposta:', response.message);
          this.curriculos = [];
          this.filteredCurriculos = [];
          this.totalCount = 0;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar currículos:', error);
        this.isLoading = false;
        this.curriculos = [];
        this.filteredCurriculos = [];
        this.totalCount = 0;
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.loadCurriculos(); // Recarrega todos os currículos
      return;
    }

    // Fazer busca na API
    this.isLoading = true;
    this.curriculoService.searchByName(this.searchTerm.trim()).subscribe({
      next: (response) => {
        if (response.success) {
          this.filteredCurriculos = response.data.data;
          this.totalCount = response.data.count;
        } else {
          console.error('Erro na busca:', response.message);
          this.filteredCurriculos = [];
          this.totalCount = 0;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erro ao buscar currículos:', error);
        this.filteredCurriculos = [];
        this.totalCount = 0;
        this.isLoading = false;
      }
    });
  }

  onClearSearch(): void {
    this.searchTerm = '';
    this.loadCurriculos(); // Recarrega todos os currículos
  }


  onView(id: string): void {
    this.router.navigate(['/curriculo/view', id]);
  }

  // onDelete(id: string): void {
  //   if (confirm('Tem certeza que deseja excluir este currículo?')) {
  //     this.curriculoService.deleteCurriculo(id).subscribe({
  //       next: () => {
  //         console.log('Currículo excluído com sucesso');
  //         this.loadCurriculos(); // Recarrega a lista
  //       },
  //       error: (error: any) => {
  //         console.error('Erro ao excluir currículo:', error);
  //       }
  //     });
  //   }
  // }

  getFormattedDate(date: string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('pt-BR');
  }
}