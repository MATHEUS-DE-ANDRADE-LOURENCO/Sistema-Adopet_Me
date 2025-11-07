package com.adopetme.controllers;

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
@RequestMapping("/auth")
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
    public ResponseEntity<?> login(@RequestBody User loginData) {
        Optional<User> user = userRepository.findByEmail(loginData.getEmail());

        if(user.isEmpty()) {
            return ResponseEntity.status(404).body("Usuário não encontrado...");
        }

        if (!passwordEncoder.matches(loginData.getPassword(), user.get().getPassword())) {
            return ResponseEntity.status(401).body("Senha incorreta...");
        }

        String jwtToken = jwtTokenProvider.generateToken(user.get().getEmail());

        return ResponseEntity.ok(new AuthResponse(jwtToken, "Login realizado com sucesso!"));
    }

    // 5. NOVO ENDPOINT DE REGISTRO (usando Map)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        
        // Lemos os dados do Map
        String email = payload.get("email");
        String senha = payload.get("senha");
        String tipoUsuario = payload.get("tipoUsuario");

        // Validação 1: Checar se o e-mail já existe
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(400).body("Este e-mail já está em uso.");
        }

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setSenha(passwordEncoder.encode(senha));
        newUser.setTipoUsuario(tipoUsuario);
        newUser.setLogin(email); // Usando email como login

        try {
            if ("TUTOR".equals(tipoUsuario)) {
                // Salva dados do Tutor lendo do Map
                newUser.setNome(payload.get("nome"));
                newUser.setSobrenome(payload.get("sobrenome"));
                userRepository.save(newUser);

            } else if ("ONG".equals(tipoUsuario)) {
                // Salva dados da ONG lendo do Map
                Ong newOng = new Ong();
                newOng.setNome(payload.get("nomeOng"));
                newOng.setEmail(email);
                newOng.setTelefone(payload.get("telefone"));
                newOng.setEndereco(payload.get("endereco"));
                // newOng.setCnpj(payload.get("cnpj")); // Adicionar se necessário

                Ong savedOng = ongRepository.save(newOng);

                // Vincula o usuário à ONG e salva
                newUser.setNome(payload.get("nomeOng")); // Nome do usuário é o nome da ONG
                newUser.setOng(savedOng);
                userRepository.save(newUser);

            } else {
                return ResponseEntity.status(400).body("Tipo de usuário inválido.");
            }
        } catch (Exception e) {
            // Captura erros (ex: violação de constraint 'unique')
            return ResponseEntity.status(500).body("Erro ao registrar usuário: " + e.getMessage());
        }

        return ResponseEntity.ok(new AuthResponse(null, "Usuário registrado com sucesso! Faça o login."));
    }


    /**
     * Classe auxiliar para estruturar a resposta JSON enviada ao cliente.
     */
    public static class AuthResponse {
        public String token;
        public String message;

        public AuthResponse(String token, String message) {
            this.token = token;
            this.message = message;
        }
    }
}