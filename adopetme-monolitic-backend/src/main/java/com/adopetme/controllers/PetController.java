// adopetme-monolitic-backend/src/main/java/com/adopetme/controllers/PetController.java
package com.adopetme.controllers;

import com.adopetme.dtos.PetRegistrationRequest;
import com.adopetme.models.Ong;
import com.adopetme.models.Pet;
import com.adopetme.models.User;
import com.adopetme.repositories.PetRepository;
import com.adopetme.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/pets") // Prefixo /api para clareza
@CrossOrigin(origins = "*") // Permite chamadas do frontend
public class PetController {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Endpoint PÚBLICO para listar todos os pets disponíveis.
     * Usado pela página "Buscar Pets" dos Tutores.
     */
    @GetMapping
    public ResponseEntity<List<Pet>> getAllPets() {
        // No futuro, você pode querer filtrar por status "Disponível"
        List<Pet> pets = petRepository.findAll();
        return ResponseEntity.ok(pets);
    }

    /**
     * Endpoint SEGURO para ONGs registrarem novos pets.
     * Usado pela nova página "Registro de Pets".
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerPet(@RequestBody PetRegistrationRequest petRequest, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Autenticação necessária.");
        }

        try {
            // 1. Encontra o usuário (admin da ONG) que está logado
            String userEmail = authentication.getName();
            User adminOngUser = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

            // 2. Verifica se este usuário está associado a uma ONG
            Ong ong = adminOngUser.getOng();
            if (ong == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Este usuário não está associado a uma ONG.");
            }

            // 3. Cria a nova entidade Pet
            Pet newPet = new Pet();
            newPet.setOng(ong); // Associa o Pet à ONG do usuário logado
            newPet.setNome(petRequest.getNome());
            newPet.setEspecie(petRequest.getEspecie());
            newPet.setSexo(petRequest.getSexo());
            newPet.setIdade(petRequest.getIdade());
            newPet.setDescricao(petRequest.getDescricao());
            newPet.setStatus(petRequest.getStatus() != null ? petRequest.getStatus() : "Disponível");
            newPet.setDtCadastro(OffsetDateTime.now());

            // 4. Salva o Pet no banco
            Pet savedPet = petRepository.save(newPet);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPet);

        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao registrar pet: " + e.getMessage());
        }
    }
}