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

export interface CurriculoResumo {
  id: string;
  numeroIdentificador: string;
  nomeCompleto: string;
  nomeEmCitacoes: string;
  nacionalidade?: string;
  instituicao: string;
  resumoBreve: string;
}

export interface Pagination {
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface FiltrosBusca {
  nome?: string;
  instituicao?: string;
  temDoutorado?: boolean;
  anoAPartirDe?: string;
  linhaDePesquisa?: string;
  areaDePesquisa?: string;
  palavrasChave?: string[] ; 
  paisDeNacionalidade?: string | null;
  ehBrasileiro?: boolean | null;
  ehAmericaLatina?: boolean | null; 
  assuntos?: string[];
}


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

  getAllCurriculos(): Observable<ApiResponseBusca> {
    return this.http.get<ApiResponseBusca>(`${this.apiUrl}`, this.getHttpOptions());
  }

  searchWithFilters(filtros: FiltrosBusca): Observable<ApiResponseBusca> {
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

    if (filtros.anoAPartirDe && filtros.anoAPartirDe !== '' && Number(filtros.anoAPartirDe) > 0) {
      filtrosLimpos.anoAPartirDe = Number(filtros.anoAPartirDe);
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
    
    if (filtros.assuntos && filtros.assuntos.length > 0) {
      filtrosLimpos.assuntos = filtros.assuntos;
    }

    return this.http.post<ApiResponseBusca>(`${this.apiUrl}/busca`, filtrosLimpos, this.getHttpOptions());
  }

 

  getCurriculoById(id: string): Observable<ApiResponse<Curriculo>> {
    return this.http.get<ApiResponse<Curriculo>>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }
}

export type { Curriculo };
