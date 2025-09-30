package com.adopetme.services;

import org.springframework.stereotype.Service;

// Realizando primeiro teste - Sem gravar
// Realizando segundo teste - Sem gravar
// Realizando terceiro teste - Sem gravar
// Realizando quarto teste- Sem gravar

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
