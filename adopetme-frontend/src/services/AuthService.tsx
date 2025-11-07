// adopetme-frontend/src/services/AuthService.tsx

// Use full backend URL to avoid proxy/CORS surprises during local development
const API_BASE_URL = "http://localhost:8081"; 

export interface LoginResponse {
  token: string;
  message: string;
}

export async function login(email: string, senha: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // O corpo da requisição é exatamente o que o Postman provou ser funcional:
      body: JSON.stringify({ email, senha }), 
    });

    // Se o backend retornou 200 OK, continue.
    if (response.ok) {
      const data: LoginResponse = await response.json();
      return data;
    }
    
    // Se o backend retornou um erro (401, 404, etc.), lance uma exceção.
    let errorBody;
    try {
        errorBody = await response.text(); 
    } catch {
        errorBody = `Status ${response.status}`;
    }

    // O backend retorna mensagens simples (ex: "Usuário não encontrado...") no body
    throw new Error(errorBody || `Erro de rede: ${response.status}`);

  } catch (error) {
    // Erros de rede (CORS ou Docker indisponível) ou erro lançado acima.
    if (error instanceof TypeError) {
        throw new Error("Não foi possível conectar ao servidor. Verifique se o Docker está rodando.");
    }
    throw error;
  }
}

// Lógica de Google Login
export function handleGoogleRedirect() {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
}