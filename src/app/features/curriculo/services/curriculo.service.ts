import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Curriculo } from '../models/curriculo.models';
import { AuthService } from '../../authentication/services/auth.service';

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
  private readonly userApiUrl = `${environment.apiUrl}/User`;
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthToken(): string | null {
    return this.authService.getToken();
  }

  private isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  private getHttpOptions() {
    const headers: any = {
      'Content-Type': 'application/json'
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return {
      headers: new HttpHeaders(headers)
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

  // Métodos para Favoritos
  getFavoritos(userId: string): Observable<ApiResponse<CurriculoResumo[]>> {
    if (!this.isAuthenticated()) {
      throw new Error('Usuário não autenticado para acessar favoritos');
    }
    
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }

    

    return this.http.get<ApiResponse<CurriculoResumo[]>>(`${this.userApiUrl}/${userId}/favoritos`, this.getHttpOptions());
  }

  removeFavorito(userId: string, curriculoId: string): Observable<ApiResponse<any>> {
    if (!this.isAuthenticated()) {
      throw new Error('Usuário não autenticado para remover favoritos');
    }
    
    if (!userId || !curriculoId) {
      throw new Error('ID do usuário e ID do currículo são obrigatórios');
    }

    return this.http.delete<ApiResponse<any>>(`${this.userApiUrl}/${userId}/favoritos/${curriculoId}`, this.getHttpOptions());
  }

  addFavorito(userId: string, curriculoId: string): Observable<ApiResponse<any>> {
    if (!this.isAuthenticated()) {
      throw new Error('Usuário não autenticado para adicionar favoritos');
    }
    
    if (!userId || !curriculoId) {
      throw new Error('ID do usuário e ID do currículo são obrigatórios');
    }

    return this.http.post<ApiResponse<any>>(`${this.userApiUrl}/${userId}/favoritos`, { curriculoId }, this.getHttpOptions());
  }

  vincularMeuCurriculo(userId: string, curriculoId: string): Observable<ApiResponse<any>> {
    if (!this.isAuthenticated()) {
      throw new Error('Usuário não autenticado para vincular currículo');
    }
    
    if (!userId || !curriculoId) {
      throw new Error('ID do usuário e ID do currículo são obrigatórios');
    }

    return this.http.post<ApiResponse<any>>(`${this.userApiUrl}/${userId}/meuCurriculo`, { curriculoId }, this.getHttpOptions());
  }

  getMeuCurriculo(userId: string): Observable<ApiResponse<Curriculo>> {
    if (!this.isAuthenticated()) {
      throw new Error('Usuário não autenticado para buscar currículo');
    }
    
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }

    return this.http.get<ApiResponse<Curriculo>>(`${this.userApiUrl}/${userId}/meuCurriculo`, this.getHttpOptions());
  }

  desvincularMeuCurriculo(userId: string): Observable<ApiResponse<any>> {
    if (!this.isAuthenticated()) {
      throw new Error('Usuário não autenticado para desvincular currículo');
    }
    
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }

    return this.http.delete<ApiResponse<any>>(`${this.userApiUrl}/${userId}/meuCurriculo`, this.getHttpOptions());
  }

  // Métodos para Histórico
  addToHistorico(userId: string, curriculoId: string): Observable<ApiResponse<any>> {
    if (!this.isAuthenticated()) {
      throw new Error('Usuário não autenticado para adicionar ao histórico');
    }
    
    if (!userId || !curriculoId) {
      throw new Error('ID do usuário e ID do currículo são obrigatórios');
    }

    // Verificar se não é o próprio currículo do usuário
    const meuCurriculoId = localStorage.getItem('idMeuCurriculo');
    if (meuCurriculoId && meuCurriculoId === curriculoId) {
      throw new Error('Você não pode adicionar seu próprio currículo ao histórico');
    }

    return this.http.post<ApiResponse<any>>(`${this.userApiUrl}/${userId}/historico`, { curriculoId }, this.getHttpOptions());
  }

  getHistorico(userId: string): Observable<ApiResponse<CurriculoResumo[]>> {
    if (!this.isAuthenticated()) {
      throw new Error('Usuário não autenticado para acessar histórico');
    }
    
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }

    return this.http.get<ApiResponse<CurriculoResumo[]>>(`${this.userApiUrl}/${userId}/historico`, this.getHttpOptions());
  }

  removeFromHistorico(userId: string, curriculoId: string): Observable<ApiResponse<any>> {
    if (!this.isAuthenticated()) {
      throw new Error('Usuário não autenticado para remover do histórico');
    }
    
    if (!userId || !curriculoId) {
      throw new Error('ID do usuário e ID do currículo são obrigatórios');
    }

    return this.http.delete<ApiResponse<any>>(`${this.userApiUrl}/${userId}/historico/${curriculoId}`, this.getHttpOptions());
  }

  clearHistorico(userId: string): Observable<ApiResponse<any>> {
    if (!this.isAuthenticated()) {
      throw new Error('Usuário não autenticado para limpar histórico');
    }
    
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }

    return this.http.delete<ApiResponse<any>>(`${this.userApiUrl}/${userId}/historico`, this.getHttpOptions());
  }

  buscarCurriculoPorNome(nome: string): Observable<ApiResponseBusca> {
    const filtros: FiltrosBusca = { nome: nome.trim() };
    return this.searchWithFilters(filtros);
  }
}

export type { Curriculo };
