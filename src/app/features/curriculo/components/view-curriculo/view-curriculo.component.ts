import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurriculoService, Curriculo, CurriculoResumo } from '../../services/curriculo.service';
import { AuthService } from '../../../authentication/services/auth.service';
import { HistoricoComponent } from '../historico/historico.component';

@Component({
  selector: 'app-view-curriculo',
  templateUrl: './view-curriculo.component.html',
  styleUrls: ['./view-curriculo.component.scss'],
  standalone: false,
})
export class ViewCurriculoComponent implements OnInit {
  curriculo: Curriculo | null = null;
  curriculoId!: string;
  isLoading = true;
  isDeleting = false;
  activeSection: string = 'resumo'; // Seção ativa por padrão
  
  // Favoritos
  isFavorited = false;
  isTogglingFavorite = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private curriculoService: CurriculoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.curriculoId = this.route.snapshot.params['id'];
    this.loadCurriculo();
  }

  private loadCurriculo(): void {
    this.isLoading = true;
    this.curriculoService.getCurriculoById(this.curriculoId).subscribe({
      next: (response) => {
        if (response.success) {
          this.curriculo = response.data;
          this.addToHistorico(); // Adiciona ao histórico quando carregado com sucesso
        } else {
          console.error('Erro na resposta:', response.message);
          this.router.navigate(['/curriculo']);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar currículo:', error);
        this.isLoading = false;
        this.router.navigate(['/curriculo']);
      }
    });
  }
 
  // onDelete(): void {
  //   if (confirm('Tem certeza que deseja excluir este currículo? Esta ação não pode ser desfeita.')) {
  //     this.isDeleting = true;
  //     this.curriculoService.deleteCurriculo(this.curriculoId).subscribe({
  //       next: () => {
  //         console.log('Currículo excluído com sucesso');
  //         this.router.navigate(['/curriculo']);
  //       },
  //       error: (error: any) => {
  //         console.error('Erro ao excluir currículo:', error);
  //         this.isDeleting = false;
  //       }
  //     });
  //   }
  // }

  onBack(): void {
    this.router.navigate(['/curriculo']);
  }

  toggleSection(section: string): void {
    this.activeSection = this.activeSection === section ? '' : section;
  }

  toggleFavorite(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('Usuário não logado');
      return;
    }

    if (this.isTogglingFavorite) {
      return; // Evitar múltiplos cliques
    }

    this.isTogglingFavorite = true;

    if (this.isFavorited) {
      this.removeFavorite(userId);
    } else {
      this.addFavorite(userId);
    }
  }

  private addFavorite(userId: string): void {
    this.curriculoService.addFavorito(userId, this.curriculoId).subscribe({
      next: (response) => {
        if (response.success) {
          this.isFavorited = true;
          console.log('Currículo adicionado aos favoritos');
        } else {
          console.error('Erro ao adicionar aos favoritos:', response.message);
        }
        this.isTogglingFavorite = false;
      },
      error: (error) => {
        console.error('Erro ao adicionar aos favoritos:', error);
        this.isTogglingFavorite = false;
      }
    });
  }

  private removeFavorite(userId: string): void {
    this.curriculoService.removeFavorito(userId, this.curriculoId).subscribe({
      next: (response) => {
        if (response.success) {
          this.isFavorited = false;
          console.log('Currículo removido dos favoritos');
        } else {
          console.error('Erro ao remover dos favoritos:', response.message);
        }
        this.isTogglingFavorite = false;
      },
      error: (error) => {
        console.error('Erro ao remover dos favoritos:', error);
        this.isTogglingFavorite = false;
      }
    });
  }

  private addToHistorico(): void {
    if (this.curriculo && this.curriculo.id) {
      const curriculoResumo: CurriculoResumo = {
        id: this.curriculo.id,
        numeroIdentificador: this.curriculo.numeroIdentificador,
        nomeCompleto: this.curriculo.identificacao?.nomeCompleto || 'Nome não disponível',
        nomeEmCitacoes: this.curriculo.identificacao?.nomeEmCitacoesBibliograficas || '',
        nacionalidade: this.curriculo.identificacao?.paisDeNacionalidade || '',
        instituicao: this.curriculo.dadosGerais?.endereco?.nomeInstituicaoEmpresa || '',
        resumoBreve: this.curriculo.dadosGerais?.textoResumoCvRh || ''
      };
      
      HistoricoComponent.addToHistorico(curriculoResumo);
    }
  }

 

  // getFormattedDate(date: string): string {
  //   if (!date) return 'N/A';
  //   return new Date(date).toLocaleDateString('pt-BR', {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric'
  //   });
  // }

  // formatText(text: string): string[] {
  //   if (!text) return [];
  //   return text.split('\n').filter(line => line.trim().length > 0);
  // }
}