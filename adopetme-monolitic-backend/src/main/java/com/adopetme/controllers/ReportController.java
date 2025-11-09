// adopetme-monolitic-backend/src/main/java/com/adopetme/controllers/ReportController.java
package com.adopetme.controllers;

import com.adopetme.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // Para verificar se o usuário está logado
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/report")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private EmailService emailService;

    @PostMapping
    public ResponseEntity<?> handleReport(
            @RequestBody Map<String, String> payload,
            Authentication authentication // Será null se o usuário não estiver logado
    ) {
        String reportMessage = payload.get("message");
        if (reportMessage == null || reportMessage.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("A mensagem da denúncia não pode estar vazia.");
        }

        // Verifica se o usuário está logado
        String reporterEmail = "Usuário Anônimo";
        if (authentication != null && authentication.isAuthenticated()) {
            reporterEmail = authentication.getName(); // Pega o e-mail do usuário logado
        }

        try {
            emailService.sendReportEmail(reporterEmail, reportMessage);
            return ResponseEntity.ok().body("Denúncia enviada com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao processar a denúncia.");
        }
    }
}