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

    if (response.ok) {
      const data: LoginResponse = await response.json();
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
        throw new Error("Não foi possível conectar ao servidor. Verifique se o Docker está rodando.");
    }
    throw error;
  }
}

// 3. NOVA FUNÇÃO DE REGISTRO
export async function register(formData: RegisterData): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data: RegisterResponse = await response.json();
      return data;
    }

    // Tratar erros
    let errorBody;
    try {
        errorBody = await response.text(); // Tenta pegar a mensagem de erro (ex: "Email já existe")
    } catch {
        errorBody = `Status ${response.status}`;
    }
    throw new Error(errorBody || `Erro de rede: ${response.status}`);

  } catch (error) {
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