package com.adopetme.services;

import org.springframework.stereotype.Service;

@Service
public class Calculator {
    // comentario
    public double somar(double a, double b){
        return a+b;
    }
    public double subtrair(double a, double b){
        return a-b;
    }
    public double multiplicar(double a, double b){
        return a*b;
    }
    public double dividir(double a, double b) {
        if (b == 0) {
            throw new ArithmeticException("Divide by zero");
        }
        return a / b;
    }
}
