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
import java.util.stream.Collectors;
import java.util.List;
import java.util.Optional;

// --- IMPORTAÇÕES QUE FALTAVAM ---
import com.adopetme.repositories.PetFotoRepository;
import com.adopetme.models.PetFoto;
// --- FIM DAS IMPORTAÇÕES QUE FALTAVAM ---


@RestController
@RequestMapping("/api/pets") // Prefixo /api para clareza
@CrossOrigin(origins = "*") // Permite chamadas do frontend
public class PetController {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    // --- VARIÁVEL QUE FALTAVA (INJEÇÃO DE DEPENDÊNCIA) ---
    @Autowired
    private PetFotoRepository petFotoRepository;

    /**
     * Endpoint PÚBLICO para listar todos os pets disponíveis.
     */
    @GetMapping
    public ResponseEntity<List<Pet>> getAllPets() {
        List<Pet> pets = petRepository.findAll();
        // Para cada pet, busca sua foto principal
        pets.forEach(this::setPrincipalFotoUrl); 
        return ResponseEntity.ok(pets);
    }

    /**
     * Endpoint PÚBLICO para buscar um pet específico pelo ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Pet> getPetById(@PathVariable Integer id) {
        Optional<Pet> petOpt = petRepository.findById(id);
        
        if (petOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Pet pet = petOpt.get();
        // Busca a foto principal do pet
        setPrincipalFotoUrl(pet); 
        return ResponseEntity.ok(pet);
    }


    /**
     * Endpoint SEGURO para ONGs registrarem novos pets.
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerPet(@RequestBody PetRegistrationRequest petRequest, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Autenticação necessária.");
        }

        try {
            // 1. Encontra o usuário (admin da ONG) que está logado
            User adminOngUser = findUserByAuth(authentication);

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
            newPet.setNinhada(petRequest.getNinhada());
            newPet.setCastracao(petRequest.getCastracao());
            newPet.setDtNascimento(petRequest.getDtNascimento());


            // 5. Salva o Pet no banco
            Pet savedPet = petRepository.save(newPet);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPet);

        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao registrar pet: " + e.getMessage());
        }
    }
    
    // ==========================================================
    // MÉTODOS DE GERENCIAMENTO DE PETS
    // ==========================================================

    /**
     * Endpoint SEGURO para ONGs listarem APENAS OS SEUS pets.
     */
    @GetMapping("/my-ong")
    public ResponseEntity<List<Pet>> getMyOngPets(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            User adminOngUser = findUserByAuth(authentication);
            Ong ong = adminOngUser.getOng();
            if (ong == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(List.of());
            }

            // Busca todos os pets e filtra apenas os da ONG do usuário
            List<Pet> ongPets = petRepository.findAll().stream()
                    .filter(pet -> pet.getOng().getId().equals(ong.getId()))
                    .collect(Collectors.toList());
            
            // Adiciona a URL da foto para cada pet da lista
            ongPets.forEach(this::setPrincipalFotoUrl);
            
            return ResponseEntity.ok(ongPets);

        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(List.of());
        }
    }

    /**
     * Endpoint SEGURO para ONGs ATUALIZAREM um pet.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePet(
            @PathVariable Integer id,
            @RequestBody PetRegistrationRequest petRequest, // Reutiliza o DTO de registro
            Authentication authentication) {
        
        try {
            User adminOngUser = findUserByAuth(authentication);
            // 1. Verifica se o Pet existe E se pertence à ONG do usuário
            Pet pet = verifyPetOwnership(id, adminOngUser);

            // 2. Atualiza o pet com os novos dados
            pet.setNome(petRequest.getNome());
            pet.setEspecie(petRequest.getEspecie());
            pet.setSexo(petRequest.getSexo());
            pet.setIdade(petRequest.getIdade());
            pet.setDescricao(petRequest.getDescricao());
            pet.setStatus(petRequest.getStatus());
            pet.setNinhada(petRequest.getNinhada());
            pet.setCastracao(petRequest.getCastracao());
            pet.setDtNascimento(petRequest.getDtNascimento());

            Pet savedPet = petRepository.save(pet);
            return ResponseEntity.ok(savedPet);

        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (IllegalAccessException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Endpoint SEGURO para ONGs DELETAREM um pet.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePet(@PathVariable Integer id, Authentication authentication) {
        try {
            User adminOngUser = findUserByAuth(authentication);
            // 1. Verifica se o Pet existe E se pertence à ONG do usuário
            Pet pet = verifyPetOwnership(id, adminOngUser);

            // 2. Deleta o pet
            petRepository.delete(pet);
            return ResponseEntity.ok().body("Pet " + pet.getNome() + " deletado com sucesso.");

        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (IllegalAccessException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


    // ==========================================================
    // MÉTODOS AUXILIARES
    // ==========================================================

    private User findUserByAuth(Authentication authentication) {
        String userEmail = authentication.getName();
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
    }
    
    private Pet verifyPetOwnership(Integer petId, User adminOngUser) throws IllegalAccessException {
        Ong ong = adminOngUser.getOng();
        if (ong == null) {
            throw new IllegalAccessException("Este usuário não está associado a uma ONG.");
        }

        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet não encontrado com ID: " + petId));

        if (!pet.getOng().getId().equals(ong.getId())) {
            throw new IllegalAccessException("Acesso negado. Este pet não pertence à sua ONG.");
        }
        
        return pet;
    }
    
    /**
     * Busca a foto principal de um pet e a define no campo 'fotoUrl'
     */
    private void setPrincipalFotoUrl(Pet pet) {
        // Tenta encontrar uma foto marcada como "principal"
        // Esta é a linha que estava dando o erro de compilação
        Optional<PetFoto> fotoOpt = petFotoRepository.findFirstByPetAndFtPrincipal(pet, true);
        
        if (fotoOpt.isPresent()) {
            pet.setFotoUrl(fotoOpt.get().getUrl());
        }
    }
}