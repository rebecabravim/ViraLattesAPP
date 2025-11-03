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
  instituicao: string;
  resumoBreve: string;
}

// Interface para a resposta da API de busca/listagem
interface ApiResponseBusca {
  success: boolean;
  message: string;
  data: {
    count: number;
    data: CurriculoResumo[];
  };
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

  // Buscar currículos por nome (usando a API real)
  searchByName(name: string): Observable<ApiResponseBusca> {
    const params = { name: name.trim() };
    
    return this.http.get<ApiResponseBusca>(`${this.apiUrl}/search`, { 
      ...this.getHttpOptions(), 
      params 
    });
  }

  // Buscar currículo por Nome específico
  getCurriculoByNome(nome: string): Observable<ApiResponse<Curriculo>> {
    return this.http.get<ApiResponse<Curriculo>>(`${this.apiUrl}/search`, { 
      ...this.getHttpOptions(), 
      params: { name: nome } 
    });
  }

  // Buscar currículo por ID (se necessário)
  getCurriculoById(id: string): Observable<ApiResponse<Curriculo>> {
    return this.http.get<ApiResponse<Curriculo>>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }
}

export type { Curriculo };
