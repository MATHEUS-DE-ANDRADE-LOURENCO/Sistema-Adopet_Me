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
import java.util.Optional; // 1. IMPORTAR OPTIONAL
import java.util.stream.Collectors; // <-- ADICIONE ESTE IMPORT

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
     * ==========================================================
     * 2. NOVO ENDPOINT ADICIONADO
     * ==========================================================
     * Endpoint PÚBLICO para buscar um pet específico pelo ID.
     * Usado pela página de "Detalhes do Pet".
     */
    @GetMapping("/{id}")
    public ResponseEntity<Pet> getPetById(@PathVariable Integer id) {
        Optional<Pet> pet = petRepository.findById(id);
        
        if (pet.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(pet.get());
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

            // ==========================================================
            // 4. ATUALIZAÇÃO: Mapeando os novos campos
            // ==========================================================
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
    // NOVOS MÉTODOS DE GERENCIAMENTO DE PETS
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
                // Se o usuário não é de ONG, retorna lista vazia
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(List.of());
            }

            // Busca todos os pets e filtra apenas os da ONG do usuário
            // Em uma aplicação maior, faríamos isso com uma query customizada no repositório
            List<Pet> ongPets = petRepository.findAll().stream()
                    .filter(pet -> pet.getOng().getId().equals(ong.getId()))
                    .collect(Collectors.toList());
            
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
            // dtCadastro e ong não mudam

            Pet savedPet = petRepository.save(pet);
            return ResponseEntity.ok(savedPet);

        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (IllegalAccessException e) {
            // Se o pet não pertencer à ONG
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (RuntimeException e) {
            // Se o pet não for encontrado (do verifyPetOwnership)
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
    // MÉTODOS AUXILIARES (REPETIDOS DO OngController)
    // ==========================================================

    private User findUserByAuth(Authentication authentication) {
        String userEmail = authentication.getName();
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
    }
    
    /**
     * Verifica se o pet (pelo id) pertence à ONG do usuário logado.
     * @return O objeto Pet se a posse for verificada.
     * @throws RuntimeException Se o pet não for encontrado.
     * @throws IllegalAccessException Se o pet não pertencer à ONG do usuário.
     */
    private Pet verifyPetOwnership(Integer petId, User adminOngUser) throws IllegalAccessException {
        Ong ong = adminOngUser.getOng();
        if (ong == null) {
            throw new IllegalAccessException("Este usuário não está associado a uma ONG.");
        }

        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet não encontrado com ID: " + petId));

        // Ponto crucial de segurança:
        if (!pet.getOng().getId().equals(ong.getId())) {
            throw new IllegalAccessException("Acesso negado. Este pet não pertence à sua ONG.");
        }
        
        return pet;
    }
}