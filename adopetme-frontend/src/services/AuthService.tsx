// adopetme-frontend/src/services/AuthService.tsx

// 1. Atualiza a URL base para incluir /api
const API_BASE_URL = "http://localhost:8081/api"; 

// 2. Atualiza a interface de resposta para incluir userRole
export interface LoginResponse {
  token: string;
  message: string;
  userRole: string; // Adicionado
}

// 3. Define o tipo para os dados de registro
// (Este tipo é usado pela RegisterPage e deve ser exportado)
export type RegisterData = {
    tipoUsuario: 'TUTOR' | 'ONG';
    email: string;
    senha: string;
    nome?: string;
    sobrenome?: string;
    nomeOng?: string;
    telefone?: string;
    endereco?: string;
}
// 4. Define o tipo de resposta do registro
export interface RegisterResponse {
    token: string | null;
    message: string;
    userRole: string;
}


export async function login(email: string, senha: string): Promise<LoginResponse> {
  try {
    // 5. Atualiza o endpoint para /api/auth/login
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
      return data; // Retorna { token, message, userRole }
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

// 6. Atualiza a função de registro
export async function register(formData: RegisterData): Promise<RegisterResponse> {
  try {
    // 7. Atualiza o endpoint para /api/auth/register
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
    // 8. ATENÇÃO: O endpoint de OAuth NÃO está sob /api
    window.location.href = `http://localhost:8081/oauth2/authorization/google`;
}