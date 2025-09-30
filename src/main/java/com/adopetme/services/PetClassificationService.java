package com.adopetme.services;

import org.springframework.stereotype.Service;

@Service
public class PetClassificationService {

    public String classificarPorPorte(double pesoEmKg) {
        if (pesoEmKg < 0) {
            throw new IllegalArgumentException("O peso não pode ser negativo...");
        }

        if (pesoEmKg <= 10) {
            return "Pequeno";
        }
        if (pesoEmKg <= 25) {
            return "Médio";
        } else {
            return "Grande";
        }
    }
}
