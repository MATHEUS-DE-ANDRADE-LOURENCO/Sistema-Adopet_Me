// adopetme-frontend/src/models/PetModel.tsx
export type Pet = {
    id: number;
    nome: string;
    especie: string;
    sexo: string;
    idade: number; 
    descricao: string;
    status: string;
    ninhada?: string;
    castracao: boolean;
    dtNascimento?: string;
    fotoUrl?: string; 
};