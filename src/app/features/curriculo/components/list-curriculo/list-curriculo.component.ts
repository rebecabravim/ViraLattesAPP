import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CurriculoService, Curriculo, CurriculoResumo, FiltrosBusca, Pagination } from '../../services/curriculo.service';
import { LoaderService } from '../../../shared/services/loader.service';

@Component({
  selector: 'app-list-curriculo',
  templateUrl: './list-curriculo.component.html',
  styleUrls: ['./list-curriculo.component.scss'],
  standalone: false,
})
export class ListCurriculoComponent implements OnInit {
  curriculos: CurriculoResumo[] = [];
  searchTerm = '';
  filteredCurriculos: CurriculoResumo[] = [];
  totalCount = 0;
  filtrosAtivos: FiltrosBusca = {};
  showFilters = false;
  
  // Paginação
  pagination: Pagination = {
    totalRecords: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false
  };
  currentPage = 1;
  pageSize = 10;

  constructor(
    private curriculoService: CurriculoService,
    private router: Router,
    private route: ActivatedRoute,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const searchParam = params['search'];
      if (searchParam) {
        this.searchTerm = searchParam;
        this.onSearch();
      } else {
      }
    });
   }

   

  onSearch(): void {
    const filtros: FiltrosBusca = { nome: this.searchTerm.trim() };
    this.onSearchWithFilters(filtros);
  }
 
  onSearchWithFilters(filtros: FiltrosBusca): void {
    this.filtrosAtivos = filtros;
    this.currentPage = 1; // Reset para primeira página
    this.loadCurriculosWithPagination();
  }

  loadCurriculosWithPagination(): void {
    this.loaderService.show();
    
    console.log('Filtros avançados recebidos:', this.filtrosAtivos);
    
    this.curriculoService.searchWithFilters(this.filtrosAtivos, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        if (response.success) {
          this.filteredCurriculos = response.data;
          this.pagination = response.pagination;
          this.totalCount = response.pagination.totalRecords;
        } else {
          console.error('Erro na busca com filtros:', response.message);
          this.filteredCurriculos = [];
          this.totalCount = 0;
        }
        this.loaderService.hide();
      },
      error: (error: any) => {
        console.error('Erro ao buscar currículos com filtros:', error);
        this.filteredCurriculos = [];
        this.totalCount = 0;
        this.loaderService.hide();
      }
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.pagination.totalPages) {
      this.currentPage = page;
      this.loadCurriculosWithPagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const totalPages = this.pagination.totalPages;
    const current = this.currentPage;
    
    // Mostrar no máximo 5 páginas
    let startPage = Math.max(1, current - 2);
    let endPage = Math.min(totalPages, current + 2);
    
    // Ajustar se estiver no início ou fim
    if (current <= 3) {
      endPage = Math.min(5, totalPages);
    }
    if (current >= totalPages - 2) {
      startPage = Math.max(1, totalPages - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  onClearFilters(): void {
    this.filtrosAtivos = {};
    this.searchTerm = '';
    this.filteredCurriculos = [];
    this.totalCount = 0;
  }

  hasActiveFilters(): boolean {
    return Object.keys(this.filtrosAtivos).length > 0;
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