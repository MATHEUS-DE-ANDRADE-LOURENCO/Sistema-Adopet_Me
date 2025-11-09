// adopetme-frontend/src/services/OngService.tsx
import { Ong } from '../models/OngModel';

const API_BASE_URL = "http://localhost:8081/api";

/**
 * Busca os detalhes da ONG do admin logado.
 */
export async function getMyOngDetails(token: string): Promise<Ong> {
    try {
        const response = await fetch(`${API_BASE_URL}/ong/me`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Falha ao buscar dados da ONG.");
        }
        
        return await response.json();

    } catch (error) {
        console.error("Erro em getMyOngDetails:", error);
        if (error instanceof TypeError) {
             throw new Error("Não foi possível conectar ao servidor.");
        }
        throw error;
    }
}

/**
 * Atualiza os detalhes da ONG do admin logado.
 * Usamos Partial<Ong> pois podemos enviar apenas os campos que queremos mudar.
 */
export async function updateMyOngDetails(ongData: Partial<Ong>, token: string): Promise<Ong> {
    try {
        const response = await fetch(`${API_BASE_URL}/ong/me`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(ongData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Falha ao atualizar dados da ONG.");
        }
        
        return await response.json();

    } catch (error) {
        console.error("Erro em updateMyOngDetails:", error);
         if (error instanceof TypeError) {
             throw new Error("Não foi possível conectar ao servidor.");
        }
        throw error;
    }
}