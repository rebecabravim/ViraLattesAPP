// ===========================================
// INTERFACES PARA CURRÍCULO LATTES
// ===========================================

// ===== INTERFACES BASE =====
export interface BaseEntity {
  id?: string;
  palavrasChave?: string[];
}

export interface Autor {
  nomeCompleto: string;
  nomeEmCitacoesBibliograficas: string;
}

// ===== IDENTIFICAÇÃO =====
export interface Identificacao {
  nomeCompleto: string;
  nomeEmCitacoesBibliograficas: string;
  numeroIdentificador: string;
  paisDeNacionalidade: string;
}

// ===== ENDEREÇO PROFISSIONAL =====
export interface EnderecoProfissional {
  nomeInstituicaoEmpresa: string;
  nomeOrgao: string;
  nomeUnidade: string;
  pais: string;
  uf: string;
  cep: string;
  cidade: string;
  bairro: string;
  ddd: string;
  telefone: string;
}

// ===== FORMAÇÕES ACADÊMICAS =====
export interface FormacaoAcademica extends BaseEntity {
  tipo: string; // "Doutorado" | "Mestrado" | "Graduação" | "Pós-Doutorado"
  nomeInstituicao: string;
  nomeCurso: string;
  anoDeInicio: number;
  anoDeConclusao: number;
  tituloTrabalho?: string;
  nomeOrientador?: string;
}

// ===== DISCIPLINAS =====
export interface Disciplina {
  nomeDisciplina: string;
  sequencia: number;
}

// ===== ATIVIDADES =====
export interface AtividadeEnsino {
  tipo: string;
  tipoEnsino: string;
  nomeCurso: string;
  anoInicio: number;
  anoFim?: number;
  sequencia: number;
  disciplinas: Disciplina[];
}

export interface LinhasPesquisaAtividade {
  titulo: string;
  sequencia: number;
}

export interface AtividadePesquisaEDesenvolvimento {
  tipo: string;
  nomeOrgao: string;
  anoInicio: number;
  anoFim?: number;
  sequencia: number;
  linhasDePesquisas: LinhasPesquisaAtividade[];
}

export interface Atividade {
  atividadePesquisaEDesenvolvimento?: AtividadePesquisaEDesenvolvimento;
  atividadeEnsino?: AtividadeEnsino;
}

// ===== VÍNCULOS E ATUAÇÕES =====
export interface Vinculo {
  tipoVinculo: string;
  enquadramentoFuncional: string;
  nomeInstituicao: string;
  outroVinculoInformado?: string;
  anoInicio: number;
  anoFim?: number;
  atividades: Atividade[];
}

export interface AtuacaoProfissional {
  nomeInstituicao: string;
  sequencia: number;
  vinculos: Vinculo[];
}

// ===== LINHAS DE PESQUISA =====
export interface LinhaDePesquisa extends BaseEntity {
  titulo: string;
  sequencia: number;
}

// ===== PROJETOS DE PESQUISA =====
export interface IntegranteProjeto {
  nome: string;
  ehCoordenador: boolean;
}

export interface ProjetoDePesquisa extends BaseEntity {
  nomeProjeto: string;
  descricao: string;
  situacao: string;
  sequencia: number;
  integrantes: IntegranteProjeto[];
}

// ===== PERIÓDICOS REVISIONADOS =====
export interface PeriodicoRevisionado {
  tipoVinculo: string;
  enquadramentoFuncional: string;
  nomeInstituicao: string;
  outroVinculoInformado?: string;
  anoInicio: number;
  anoFim?: number;
  atividades?: any;
}

// ===== DADOS GERAIS =====
export interface DadosGerais {
  textoResumoCvRh: string;
  endereco: EnderecoProfissional;
  formacoesAcademicas: FormacaoAcademica[];
  posDoutorados: FormacaoAcademica[];
  formacaoComplementar: FormacaoAcademica[];
  atuacoesProfissionais: AtuacaoProfissional[];
  linhasDePesquisa: LinhaDePesquisa[];
  projetosDePesquisa: ProjetoDePesquisa[];
  periodicosRevisionados: PeriodicoRevisionado[];
}

// ===== PRODUÇÕES CIENTÍFICAS =====
export interface Artigo extends BaseEntity {
  tituloPeriodicoRevista: string;
  paginaInicial?: string;
  paginaFinal?: string;
  autores: Autor[];
}

export interface LivroPublicadoOuOrganizado extends BaseEntity {
  titulo: string;
  volume: number;
  ano: string;
  sequencia: number;
  flagRelevancia: boolean;
  nomeEditora: string;
  autores: Autor[];
}

export interface CapituloLivro extends BaseEntity {
  titulo: string;
  tituloLivro: string;
  volume: number;
  ano: string;
  sequencia: number;
  flagRelevancia: boolean;
  nomeEditora: string;
  paginaInicial: string;
  paginaFinal: string;
  autores: Autor[];
  organizadores: Autor[];
}

export interface TrabalhoCompletoPublicado extends BaseEntity {
  titulo: string;
  nomeEvento: string;
  tituloDosAnais: string;
  cidadeDoEvento: string;
  volume: number;
  ano: string;
  sequencia: number;
  flagRelevancia: boolean;
  paginaInicial: string;
  paginaFinal: string;
  autores: Autor[];
}

export interface ApresentacaoTrabalho extends BaseEntity {
  titulo: string;
  nomeEvento: string;
  natureza: string;
  ano: string;
  sequencia: number;
  autores?: Autor[];
}

export interface Producoes {
  artigos: Artigo[];
  livrosPublicadosOrganizados: LivroPublicadoOuOrganizado[];
  capituloLivros: CapituloLivro[];
  trabalhosCompletosPublicados: TrabalhoCompletoPublicado[];
  apresentacoesTrabalhos: ApresentacaoTrabalho[];
}

// ===== BANCAS =====
export interface Banca extends BaseEntity {
  titulo: string;
  nomeOrientado: string;
  natureza: string;
  curso: string;
  instituicao: string;
  ano: string;
  sequencia: number;
  autores: Autor[];
}

export interface Bancas {
  bancaMestrados: Banca[];
  bancaTcc: Banca[];
}

// ===== EVENTOS =====
export interface ParticipacaoEvento {
  titulo: string;
  nomeEvento: string;
  natureza: string;
  ano: string;
  sequencia: number;
}

export interface OrganizacaoEvento {
  titulo: string;
  nomeEvento: string;
  natureza: string;
  ano: string;
  sequencia: number;
  autores: Autor[];
}

export interface Eventos {
  participacoes: ParticipacaoEvento[];
  organizacoes: OrganizacaoEvento[];
}

// ===== ORIENTAÇÕES =====
export interface Orientacao extends BaseEntity {
  titulo: string;
  nomeOrientado: string;
  natureza: string;
  curso: string;
  instituicao: string;
  ano: string;
  sequencia: number;
  autores: Autor[];
}

export interface Orientacoes {
  orientacoesEmAndamento: Orientacao[];
  orientacoesConcluidas: Orientacao[];
}

// ===== INTERFACE PRINCIPAL DO CURRÍCULO =====
export interface Curriculo extends BaseEntity {
  numeroIdentificador: string;
  dataAtualizacao: string;
  identificacao: Identificacao;
  dadosGerais: DadosGerais;
  producoes?: Producoes;
  bancas?: Bancas;
  eventos?: Eventos;
  orientacoes?: Orientacoes;
}

// ===== TIPOS UTILITÁRIOS =====
export type TipoFormacao = 'Doutorado' | 'Mestrado' | 'Graduação' | 'Pós-Doutorado' | 'Curso de Extensão';
export type TipoVinculo = 'Servidor Público' | 'Professor Substituto' | 'Celetista' | 'Consultor' | 'Outro';
export type TipoEnsino = 'Graduação' | 'Pós-Graduação' | 'Extensão' | 'Ensino Fundamental' | 'Ensino Médio';
export type NaturezaOrientacao = 'Mestrado' | 'Doutorado' | 'Trabalho de Conclusão de Curso' | 'Iniciação Científica';
export type SituacaoProjeto = 'Em andamento' | 'Concluído' | 'Suspenso' | 'Cancelado';

// ===== INTERFACES PARA BUSCA E FILTROS =====
export interface FiltrosCurriculo {
  nome?: string;
  ehBrasileiro?: boolean;
  nacionalidade?: string;
  temDoutorado?: boolean;
  anoAPartirDe?: number;
  linhaDePesquisa?: string;
  palavrasChave?: string[];
  instituicao?: string;
  areaDePesquisa?: string;
}

export interface ResultadoPaginado<T> {
  data: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// ===== INTERFACE PARA RESPOSTA DA API =====
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}