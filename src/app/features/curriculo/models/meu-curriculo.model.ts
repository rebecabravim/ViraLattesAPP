export interface MeuCurriculo {
  userId: string;
  curriculoId: string;
  dataVinculo: string;
  curriculo?: any; // Dados completos do currículo quando carregado
}

export interface MeuCurriculoRequest {
  userId: string;
  curriculoId: string;
}