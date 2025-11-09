// adopetme-frontend/src/services/PetService.tsx
import { Pet } from "../models/PetModel"; // Vamos reutilizar o modelo existente

const API_BASE_URL = "http://localhost:8081/api"; // API_BASE_URL atualizado

// ==========================================================
// 1. ATUALIZAÇÃO DA INTERFACE
// ==========================================================
export interface PetRegistrationData {
    nome: string;
    especie: string;
    sexo: string;
    idade: number;
    descricao: string;
    status?: string;

    // NOVOS CAMPOS
    ninhada?: string;
    castracao: boolean; // Mudar para boolean
    dtNascimento?: string; // Enviar como string "YYYY-MM-DD"
}

/**
 * ==========================================================
 * 2. NOVA FUNÇÃO ADICIONADA
 * ==========================================================
 * Busca um pet específico pelo ID (para Tutores)
 */
export async function getPetById(id: number): Promise<Pet> {
  try {
    const response = await fetch(`${API_BASE_URL}/pets/${id}`);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("Pet não encontrado.");
        }
        throw new Error(`Erro de rede: ${response.status}`);
    }
    
    const data: Pet = await response.json();
    return data;

  } catch (error) {
    console.error("Falha ao buscar pet por ID:", error);
    if (error instanceof TypeError) {
        throw new Error("Não foi possível conectar ao servidor.");
    }
    throw error;
  }
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

// ==========================================================
// NOVAS FUNÇÕES DE GERENCIAMENTO
// ==========================================================

/**
 * Busca todos os pets da ONG logada.
 */
export async function getMyOngPets(token: string): Promise<Pet[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/pets/my-ong`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
        throw new Error(`Erro de rede: ${response.status}`);
    }
    
    const data: Pet[] = await response.json();
    return data;

  } catch (error) {
    console.error("Falha ao buscar pets da ONG:", error);
    if (error instanceof TypeError) {
        throw new Error("Não foi possível conectar ao servidor.");
    }
    throw error;
  }
}


/**
 * Atualiza um pet existente. (Ainda não vamos usar, mas é bom ter)
 * Nota: A API espera PetRegistrationData, o mesmo DTO do registro.
 */
export async function updatePet(petId: number, petData: PetRegistrationData, token: string): Promise<Pet> {
  try {
    const response = await fetch(`${API_BASE_URL}/pets/${petId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
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

// ==========================================================
// FUNÇÃO DE UPLOAD DE FOTO
// ==========================================================
/**
 * Faz upload da foto principal de um pet.
 */
export async function uploadPetPhoto(petId: number, file: File, token: string): Promise<{ fotoUrl: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file); // O backend espera um campo "file"

    const response = await fetch(`${API_BASE_URL}/pets/${petId}/upload-photo`, {
      method: "POST",
      headers: {
        // NÃO definimos "Content-Type". O navegador faz isso
        // automaticamente para multipart/form-data.
        "Authorization": `Bearer ${token}`
      },
      body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Falha ao enviar foto.");
    }
    
    return await response.json(); // Retorna { fotoUrl: "/uploads/..." }

  } catch (error) {
    console.error("Falha ao fazer upload da foto:", error);
    if (error instanceof TypeError) {
        throw new Error("Não foi possível conectar ao servidor.");
    }
    throw error;
  }
}

/**
 * Deleta um pet.
 */
export async function deletePet(petId: number, token: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/pets/${petId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const responseText = await response.text(); // Pega a mensagem (ex: "Pet deletado")
    
    if (!response.ok) {
        throw new Error(responseText || "Falha ao deletar pet.");
    }
    
    return responseText; // Retorna a mensagem de sucesso

  } catch (error) {
    console.error("Falha ao deletar pet:", error);
    if (error instanceof TypeError) {
        throw new Error("Não foi possível conectar ao servidor.");
    }
    throw error;
  }
}