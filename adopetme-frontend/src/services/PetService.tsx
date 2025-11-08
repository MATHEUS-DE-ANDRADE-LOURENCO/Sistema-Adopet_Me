// adopetme-frontend/src/services/PetService.tsx
import { Pet } from "../models/PetModel"; // Vamos reutilizar o modelo existente

const API_BASE_URL = "http://localhost:8081/api"; // API_BASE_URL atualizado

// Tipo para os dados do formulário de registro
export interface PetRegistrationData {
    nome: string;
    especie: string;
    sexo: string;
    idade: number;
    descricao: string;
    status?: string;
}

/**
 * Busca todos os pets (para Tutores)
 */
export async function getPets(): Promise<Pet[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/pets`);

    if (!response.ok) {
        throw new Error(`Erro de rede: ${response.status}`);
    }
    
    const data: Pet[] = await response.json();
    return data;

  } catch (error) {
    console.error("Falha ao buscar pets:", error);
    if (error instanceof TypeError) {
        throw new Error("Não foi possível conectar ao servidor.");
    }
    throw error;
  }
}


/**
 * Registra um novo pet (para ONGs)
 */
export async function registerPet(petData: PetRegistrationData, token: string): Promise<Pet> {
  try {
    const response = await fetch(`${API_BASE_URL}/pets/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Header de autenticação
      },
      body: JSON.stringify(petData),
    });

    if (response.ok) {
      const data: Pet = await response.json();
      return data;
    }
    
    let errorBody;
    try {
        errorBody = await response.text(); 
    } catch {
        errorBody = `Status ${response.status}`;
    }
    throw new Error(errorBody || `Erro de rede: ${response.status}`);

  } catch (error) {
    if (error instanceof TypeError) {
        throw new Error("Não foi possível conectar ao servidor.");
    }
    throw error;
  }
}