// adopetme-monolitic-backend/src/main/java/com/adopetme/services/EmailService.java
package com.adopetme.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // E-mail que está configurado no application.properties
    private static final String SENDER_EMAIL = "hondadanilo6@gmail.com";
    
    // E-mails de destino da denúncia
    private static final String[] RECIPIENT_EMAILS = {"hondadanilo6@gmail.com", "adopet@gmail.com"};

    /**
     * Envia um e-mail de denúncia.
     * @param reporterEmail O e-mail de quem denunciou (ou "Usuário Anônimo")
     * @param reportMessage O conteúdo da denúncia
     */
    public void sendReportEmail(String reporterEmail, String reportMessage) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            
            // De: A conta que está autenticada (hondadanilo6@gmail.com)
            message.setFrom(SENDER_EMAIL);
            
            // Para: Os dois e-mails de destino
            message.setTo(RECIPIENT_EMAILS);
            
            // Assunto: Inclui quem denunciou
            message.setSubject("Nova Denúncia Recebida de: " + reporterEmail);
            
            // Corpo: Inclui o e-mail do denunciante e a mensagem
            String emailBody = "Uma nova denúncia foi registrada no Adopet.me.\n\n"
                             + "Denunciante: " + reporterEmail + "\n\n"
                             + "Mensagem:\n"
                             + "-----------------------------------\n"
                             + reportMessage
                             + "\n-----------------------------------";
            
            message.setText(emailBody);
            
            mailSender.send(message);
            
        } catch (Exception e) {
            // Em um app real, logaríamos esse erro
            System.err.println("Erro ao enviar e-mail de denúncia: " + e.getMessage());
            // Você pode querer lançar uma exceção customizada aqui
        }
    }
}