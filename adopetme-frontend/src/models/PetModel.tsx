// adopetme-frontend/src/models/PetModel.tsx
export type Pet = {
    id: number;
    nome: string;
    // tipo: string; // O backend usa 'especie'
    especie: string;
    sexo: string;
    idade: number; // Mudar para number
    descricao: string;
    status: string;
    // ong: any; // Podemos adicionar o objeto Ong se necessário
};