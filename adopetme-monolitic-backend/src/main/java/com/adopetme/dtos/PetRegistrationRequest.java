// adopetme-monolitic-backend/src/main/java/com/adopetme/dtos/PetRegistrationRequest.java
package com.adopetme.dtos;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate; // 1. Importar LocalDate

@Getter
@Setter
public class PetRegistrationRequest {
    private String nome;
    private String especie; // Ex: "Cachorro", "Gato"
    private String sexo;
    private Integer idade;
    private String descricao;
    private String status = "Disponível"; // Padrão
    
    // ==========================================================
    // 2. NOVOS CAMPOS ADICIONADOS
    // ==========================================================
    private String ninhada; // Pode ser nulo
    private Boolean castracao;
    private LocalDate dtNascimento; // Pode ser nulo
}