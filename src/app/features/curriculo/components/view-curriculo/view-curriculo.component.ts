import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurriculoService, Curriculo } from '../../services/curriculo.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private curriculoService: CurriculoService
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