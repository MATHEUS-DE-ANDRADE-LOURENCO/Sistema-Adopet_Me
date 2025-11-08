// adopetme-monolitic-backend/src/main/java/com/adopetme/dtos/PetRegistrationRequest.java
package com.adopetme.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PetRegistrationRequest {
    private String nome;
    private String especie; // Ex: "Cachorro", "Gato"
    private String sexo;
    private Integer idade;
    private String descricao;
    private String status = "Disponível"; // Padrão
    // Adicione outros campos de 'Pet.java' se desejar (ex: castracao, dtNascimento)
}