package com.adopetme.services;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

// Importa os métodos estáticos do Assertions para deixar o código mais limpo
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class CalculatorTests {

    @Autowired
    private Calculator calculator;

    @Test
    void deveSomarDoisNumerosComSucesso() {
        // Cenário (Arrange)
        double a = 5;
        double b = 6;
        double resultadoEsperado = 11; // 5 + 6 = 11

        // Ação (Act)
        double resultadoReal = calculator.somar(a, b);

        // Validação (Assert)
        assertEquals(resultadoEsperado, resultadoReal);
    }

    @Test
    void deveSubtrairDoisNumerosComSucesso() {
        // Cenário
        double a = 10;
        double b = 4;
        double resultadoEsperado = 6;

        // Ação
        double resultadoReal = calculator.subtrair(a, b);

        // Validação
        assertEquals(resultadoEsperado, resultadoReal);
    }

    @Test
    void deveMultiplicarDoisNumerosComSucesso() {
        // Cenário
        double a = 7;
        double b = 3;
        double resultadoEsperado = 21;

        // Ação
        double resultadoReal = calculator.multiplicar(a, b);

        // Validação
        assertEquals(resultadoEsperado, resultadoReal);
    }

    @Test
    void deveDividirDoisNumerosComSucesso() {
        // Cenário
        double a = 10;
        double b = 2;
        double resultadoEsperado = 5;

        // Ação
        double resultadoReal = calculator.dividir(a, b);

        // Validação
        assertEquals(resultadoEsperado, resultadoReal);
    }

    @Test
    void deveLancarExcecaoAoDividirPorZero() {
        // Cenário
        double a = 10;
        double b = 0;

        // Ação e Validação
        // Aqui, verificamos se a exceção ArithmeticException é lançada
        // quando o método dividir(a, b) é chamado.
        Exception exception = assertThrows(ArithmeticException.class, () -> {
            calculator.dividir(a, b);
        });

        // Opcional, mas recomendado: verificar a mensagem da exceção
        String mensagemEsperada = "Divide by zero";
        String mensagemReal = exception.getMessage();
        assertEquals(mensagemEsperada, mensagemReal);
    }
}