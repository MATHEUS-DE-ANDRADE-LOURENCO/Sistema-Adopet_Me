package com.adopetme.controllers;

import com.adopetme.dtos.LoginRequest;
import com.adopetme.models.User;
import com.adopetme.repositories.UserRepository;
import com.adopetme.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // 🚨 Injete o Provedor de Tokens para gerar o JWT
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // 🚨 O BCryptPasswordEncoder agora é injetado, mas mantive sua declaração para clareza
    private final BCryptPasswordEncoder passwordEncoder;

    // Construtor para injeção do BCryptPasswordEncoder (melhor prática)
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

        String jwtToken = jwtTokenProvider.generateToken(user.get().getEmail());
        return ResponseEntity.ok(new AuthResponse(jwtToken, "Login realizado com sucesso!"));
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