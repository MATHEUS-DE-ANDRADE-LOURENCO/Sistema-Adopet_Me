// adopetme-frontend/src/services/FavoritoService.tsx
import { Pet } from "../models/PetModel";

const API_BASE_URL = "http://localhost:8081/api";

/**
 * Busca todos os pets favoritos do usuário logado.
 */
export async function getMyFavoritos(token: string): Promise<Pet[]> {
    const response = await fetch(`${API_BASE_URL}/favoritos/me`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error("Falha ao buscar favoritos.");
    }
    return await response.json();
}

/**
 * Adiciona um pet aos favoritos.
 */
export async function addFavorito(petId: number, token: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/favoritos/${petId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    const responseText = await response.text();
    if (!response.ok) {
        throw new Error(responseText || "Falha ao favoritar pet.");
    }
    return responseText;
}

/**
 * Remove um pet dos favoritos.
 */
export async function removeFavorito(petId: number, token: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/favoritos/${petId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    const responseText = await response.text();
    if (!response.ok) {
        throw new Error(responseText || "Falha ao remover favorito.");
    }
    return responseText;
}

/**
 * Verifica se um pet já é favorito.
 */
export async function checkFavorito(petId: number, token: string): Promise<{ isFavorited: boolean }> {
    const response = await fetch(`${API_BASE_URL}/favoritos/check/${petId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!response.ok) {
        // Se der 404 (pet não encontrado) ou 401 (não logado), apenas retorne false
        if (response.status === 404 || response.status === 401) {
            return { isFavorited: false };
        }
        throw new Error("Falha ao checar favorito.");
    }
    return await response.json();
}