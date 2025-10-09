package com.adopetme.services;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
public class PetClassificationServiceTests {

    @Autowired
    private PetClassificationService petClassificationService;

    // --- Testes para Porte Pequeno ---

    @Test
    void deveClassificarComoPequenoSePesoForMenorQue10() {
        String porte = petClassificationService.classificarPorPorte(7.5);
        assertEquals("Pequeno", porte);
    }

    @Test
    void deveClassificarComoPequenoSePesoForExatamente10() {
        // Testar o valor limite é muito importante!
        String porte = petClassificationService.classificarPorPorte(10.0);
        assertEquals("Pequeno", porte);
    }

    // --- Testes para Porte Médio ---

    @Test
    void deveClassificarComoMedioSePesoEstiverEntre10e25() {
        String porte = petClassificationService.classificarPorPorte(18.0);
        assertEquals("Médio", porte);
    }

    @Test
    void deveClassificarComoMedioSePesoForExatamente25() {
        // Testando o outro valor limite
        String porte = petClassificationService.classificarPorPorte(25.0);
        assertEquals("Médio", porte);
    }

    // --- Testes para Porte Grande ---

    @Test
    void deveClassificarComoGrandeSePesoForMaiorQue25() {
        String porte = petClassificationService.classificarPorPorte(35.0);
        assertEquals("Grande", porte);
    }

    // --- Teste para o cenário de erro ---

    @Test
    void deveLancarExcecaoSePesoForNegativo() {
        // Cenário
        double pesoNegativo = -5.0;

        // Ação e Validação
        // Verificamos se a exceção correta (IllegalArgumentException) é lançada
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            petClassificationService.classificarPorPorte(pesoNegativo);
        });

        // Verificamos se a mensagem de erro é a que esperamos
        String mensagemEsperada = "O peso não pode ser negativo...";
        String mensagemReal = exception.getMessage();
        assertEquals(mensagemEsperada, mensagemReal);
    }
}