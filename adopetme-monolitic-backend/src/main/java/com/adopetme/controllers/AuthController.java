// adopetme-monolitic-backend/src/main/java/com/adopetme/controllers/AuthController.java
package com.adopetme.controllers;

import com.adopetme.dtos.LoginRequest;
import com.adopetme.models.User;
import com.adopetme.models.Ong; // 1. Importar Ong
import com.adopetme.repositories.UserRepository;
import com.adopetme.repositories.OngRepository; // 2. Importar OngRepository
import com.adopetme.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Map; // 3. Importar Map

@RestController
@RequestMapping("/api/auth") // MUDANÇA: Prefixo /api adicionado
@CrossOrigin(origins = "*") // Permite chamadas do frontend
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OngRepository ongRepository; // 4. Injetar OngRepository

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(BCryptPasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginData) {
        Optional<User> user = userRepository.findByEmail(loginData.getEmail());

        if (user.isEmpty()) {
            return ResponseEntity.status(404).body("Usuário não encontrado...");
        }

        if (!passwordEncoder.matches(loginData.getSenha(), user.get().getSenha())) {
            return ResponseEntity.status(401).body("Senha incorreta...");
        }

        // MUDANÇA: Gera o token E captura a role
        String jwtToken = jwtTokenProvider.generateToken(user.get().getEmail());
        String userRole = user.get().getTipoUsuario(); // Ex: "USER" ou "ADMIN_ONG"

        // MUDANÇA: Retorna o token, a mensagem E a userRole
        return ResponseEntity.ok(new AuthResponse(jwtToken, "Login realizado com sucesso!", userRole));
    }

    /**
     * ==========================================================
     * ENDPOINT DE REGISTRO
     * ==========================================================
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registerData) {
        String email = registerData.get("email");
        String tipoUsuario = registerData.get("tipoUsuario");

        // 1. Verifica se o e-mail já está em uso
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(400).body("Este e-mail já está em uso.");
        }

        try {
            String userRole; // Variável para guardar a role criada

            if ("ONG".equals(tipoUsuario)) {
                // --- Lógica de Registro de ONG ---

                // 2. Cria e salva a entidade ONG primeiro
                Ong newOng = new Ong();
                newOng.setNome(registerData.get("nomeOng"));
                newOng.setEmail(email);
                newOng.setTelefone(registerData.get("telefone"));
                newOng.setEndereco(registerData.get("endereco"));
                
                Ong savedOng = ongRepository.save(newOng);

                // 3. Cria o Usuário (admin da ONG) e associa à ONG
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setLogin(email);
                newUser.setNome(registerData.get("nomeOng"));
                newUser.setSenha(passwordEncoder.encode(registerData.get("senha")));
                newUser.setTipoUsuario("ADMIN_ONG"); // Role específica de admin de ONG
                newUser.setOng(savedOng); // Associa o usuário à ONG
                
                userRepository.save(newUser);
                userRole = "ADMIN_ONG";

            } else {
                // --- Lógica de Registro de TUTOR (Usuário Padrão) ---
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setLogin(email);
                newUser.setNome(registerData.get("nome"));
                newUser.setSobrenome(registerData.get("sobrenome"));
                newUser.setSenha(passwordEncoder.encode(registerData.get("senha")));
                newUser.setTipoUsuario("USER"); // Role padrão para tutores
                
                userRepository.save(newUser);
                userRole = "USER";
            }

            // MUDANÇA: Retorna a role (útil para consistência)
            return ResponseEntity.ok(new AuthResponse(null, "Registro realizado com sucesso!", userRole));

        } catch (Exception e) {
            // Captura qualquer erro inesperado durante o salvamento
            return ResponseEntity.status(500).body("Erro interno no servidor: " + e.getMessage());
        }
    }


    /**
     * Classe auxiliar para estruturar a resposta JSON enviada ao cliente.
     */
    public static class AuthResponse {
        public String token;
        public String message;
        public String userRole; // Campo para a role

        public AuthResponse(String token, String message, String userRole) {
            this.token = token;
            this.message = message;
            this.userRole = userRole;
        }
        
        // Sobrecarga para o registro (que não retorna token)
         public AuthResponse(String token, String message) {
            this(token, message, null);
        }
    }
}