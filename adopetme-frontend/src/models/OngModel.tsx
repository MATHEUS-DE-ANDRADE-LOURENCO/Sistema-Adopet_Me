// adopetme-frontend/src/models/OngModel.tsx

// Baseado em Ong.java
export interface Ong {
  id: number;
  nome: string;
  endereco: string;
  responsavel: string;
  telefone: string;
  tipo: string;
  email: string;
  cidade: string;
  estado: string;
  descricao: string;
  dtRegistro: string; // Vem como string ISO (OffsetDateTime)
}