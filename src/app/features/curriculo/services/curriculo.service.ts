import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Curriculo } from '../models/curriculo.models';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Interface para o currículo resumido que vem da API de busca
export interface CurriculoResumo {
  id: string;
  numeroIdentificador: string;
  nomeCompleto: string;
  nomeEmCitacoes: string;
  nacionalidade?: string;
  instituicao: string;
  resumoBreve: string;
}

// Interface para paginação
export interface Pagination {
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// Interface para filtros de busca
export interface FiltrosBusca {
  nome?: string;
  instituicao?: string;
  temDoutorado?: boolean;
  anoAPartirDe?: number;
  linhaDePesquisa?: string;
  areaDePesquisa?: string;
  palavrasChave?: string[]; 
  paisDeNacionalidade?: string;
  ehBrasileiro?: boolean;
}

// Interface para a resposta da API de busca/listagem
interface ApiResponseBusca {
  success: boolean;
  message: string;
  data: CurriculoResumo[];
  pagination: Pagination;
}

@Injectable({
  providedIn: 'root'
})
export class CurriculoService {
  private readonly apiUrl = `${environment.apiUrl}/Curriculo`;

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${this.getAuthToken()}`
      })
    };
  }

  // Buscar todos os currículos (sem filtro)
  getAllCurriculos(): Observable<ApiResponseBusca> {
    return this.http.get<ApiResponseBusca>(`${this.apiUrl}`, this.getHttpOptions());
  }

  // Buscar currículos com filtros avançados
  searchWithFilters(filtros: FiltrosBusca): Observable<ApiResponseBusca> {
    // Sempre enviar pelo menos um objeto vazio para garantir que o payload não seja null
    const filtrosLimpos: any = {};
    
    if (filtros.nome?.trim()) {
      filtrosLimpos.nome = filtros.nome.trim();
    }
    
    if (filtros.instituicao?.trim()) {
      filtrosLimpos.instituicao = filtros.instituicao.trim();
    }
    
    if (filtros.temDoutorado !== undefined && filtros.temDoutorado !== null) {
      filtrosLimpos.temDoutorado = filtros.temDoutorado;
    }
    
    if (filtros.anoAPartirDe && filtros.anoAPartirDe > 0) {
      filtrosLimpos.anoAPartirDe = filtros.anoAPartirDe;
    }
    
    if (filtros.linhaDePesquisa?.trim()) {
      filtrosLimpos.linhaDePesquisa = filtros.linhaDePesquisa.trim();
    }
    
    if (filtros.areaDePesquisa?.trim()) {
      filtrosLimpos.areaDePesquisa = filtros.areaDePesquisa.trim();
    }
    
    if (filtros.paisDeNacionalidade?.trim()) {
      filtrosLimpos.paisDeNacionalidade = filtros.paisDeNacionalidade.trim();
    }
    
    if (filtros.ehBrasileiro !== undefined && filtros.ehBrasileiro !== null) {
      filtrosLimpos.ehBrasileiro = filtros.ehBrasileiro;
    }
    
    if (filtros.palavrasChave && filtros.palavrasChave.length > 0) {
      filtrosLimpos.palavrasChave = filtros.palavrasChave;
    }

    console.log('Filtros recebidos:', filtros);
    console.log('Filtros limpos (payload):', filtrosLimpos);
    console.log('URL da requisição:', `${this.apiUrl}/busca`);

    return this.http.post<ApiResponseBusca>(`${this.apiUrl}/busca`, filtrosLimpos, this.getHttpOptions());
  }

  // Buscar currículo por Nome específico
 

  // Buscar currículo por ID (se necessário)
  getCurriculoById(id: string): Observable<ApiResponse<Curriculo>> {
    return this.http.get<ApiResponse<Curriculo>>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }
}

export type { Curriculo };
