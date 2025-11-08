// adopetme-monolitic-backend/src/main/java/com/adopetme/controllers/TestController.java
package com.adopetme.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // Importe o objeto Authentication
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.stream.Collectors; // Necessário para coletar as Roles

@RestController
@RequestMapping("/api/test") // MUDANÇA AQUI
public class TestController {

    private static final Logger logger = LoggerFactory.getLogger(TestController.class);

    @GetMapping("/user")
    public ResponseEntity<String> userAccess() {
        try {
            // 1. Obtém o objeto Authentication do contexto
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            // 2. Extrai o nome do principal (que é o email)
            String principalName = authentication.getName();

            // 3. Extrai as Roles e as formata em uma única string
            String roles = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.joining(", ")); // Ex: "ROLE_ADMIN, ROLE_USER"

            logger.info("ACESSO AUTORIZADO E PRINCIPAL ENCONTRADO: {} com Roles: {}", principalName, roles);

            // 4. Retorna a resposta completa
            return ResponseEntity.ok("SUCESSO FINAL: Autenticado como " + principalName + " | Roles: " + roles);

        } catch (Exception e) {
            logger.error("ERRO DENTRO DO TESTCONTROLLER APÓS AUTENTICAÇÃO:", e);
            // Lança exceção para que o AuthenticationEntryPoint retorne 401/500
            throw new RuntimeException("Falha na autorização interna.", e);
        }
    }
}