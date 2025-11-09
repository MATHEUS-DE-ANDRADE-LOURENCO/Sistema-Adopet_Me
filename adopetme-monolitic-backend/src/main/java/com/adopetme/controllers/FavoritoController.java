package com.adopetme.controllers;

import com.adopetme.models.Favorito;
import com.adopetme.models.Pet;
import com.adopetme.models.User;
import com.adopetme.repositories.FavoritoRepository;
import com.adopetme.repositories.PetRepository;
import com.adopetme.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/favoritos")
@CrossOrigin(origins = "*")
public class FavoritoController {

    @Autowired
    private FavoritoRepository favoritoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PetRepository petRepository;
    
    @Autowired
    private PetController petController; // Reutilizar o método de setar a foto

    // Método auxiliar para buscar o usuário logado
    private User findUserByAuth(Authentication authentication) {
        if (authentication == null) {
            throw new UsernameNotFoundException("Autenticação necessária.");
        }
        String userEmail = authentication.getName();
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
    }

    /**
     * GET /api/favoritos/me
     * Lista todos os pets favoritados pelo usuário logado.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMyFavoritos(Authentication authentication) {
        try {
            User user = findUserByAuth(authentication);

            // ==========================================================
            // CORREÇÃO: Usar o novo método findAllWithPetByUsuario
            // ==========================================================
            List<Favorito> favoritos = favoritoRepository.findAllWithPetByUsuario(user);

            // Extrai os Pets da lista de Favoritos (agora sem erro LAZY)
            List<Pet> pets = favoritos.stream()
                                      .map(Favorito::getPet)
                                      .collect(Collectors.toList());
            
            // Adiciona a fotoUrl em cada pet
            pets.forEach(petController::setPrincipalFotoUrl); // Usando o método público do PetController
            
            return ResponseEntity.ok(pets);
            
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) { // <-- ADICIONADO: Bloco catch genérico
            // Isso nos ajuda a ver qualquer outro erro no console
            e.printStackTrace(); 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno ao buscar favoritos: " + e.getMessage());
        }
    }

    /**
     * POST /api/favoritos/{petId}
     * Adiciona um pet aos favoritos.
     */
    @PostMapping("/{petId}")
    public ResponseEntity<?> addFavorito(@PathVariable Integer petId, Authentication authentication) {
        try {
            User user = findUserByAuth(authentication);
            Pet pet = petRepository.findById(petId)
                    .orElseThrow(() -> new RuntimeException("Pet não encontrado"));

            // Verifica se já não é favorito
            if (favoritoRepository.existsByUsuarioAndPet(user, pet)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Pet já está nos favoritos.");
            }

            Favorito novoFavorito = new Favorito();
            novoFavorito.setUsuario(user);
            novoFavorito.setPet(pet);
            favoritoRepository.save(novoFavorito);
            
            return ResponseEntity.status(HttpStatus.CREATED).body("Pet favoritado com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    /**
     * DELETE /api/favoritos/{petId}
     * Remove um pet dos favoritos.
     */
    @DeleteMapping("/{petId}")
    public ResponseEntity<?> removeFavorito(@PathVariable Integer petId, Authentication authentication) {
        try {
            User user = findUserByAuth(authentication);
            Pet pet = petRepository.findById(petId)
                    .orElseThrow(() -> new RuntimeException("Pet não encontrado"));

            Favorito favorito = favoritoRepository.findByUsuarioAndPet(user, pet)
                    .orElseThrow(() -> new RuntimeException("Pet não está nos favoritos."));

            favoritoRepository.delete(favorito);
            return ResponseEntity.ok("Pet removido dos favoritos.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    /**
     * GET /api/favoritos/check/{petId}
     * Verifica se um pet específico já está favoritado.
     */
    @GetMapping("/check/{petId}")
    public ResponseEntity<?> checkFavorito(@PathVariable Integer petId, Authentication authentication) {
        try {
            User user = findUserByAuth(authentication);
            Pet pet = petRepository.findById(petId)
                    .orElseThrow(() -> new RuntimeException("Pet não encontrado"));

            boolean isFavorited = favoritoRepository.existsByUsuarioAndPet(user, pet);
            
            // Retorna um JSON simples: { "isFavorited": true/false }
            return ResponseEntity.ok(Map.of("isFavorited", isFavorited));
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (RuntimeException e) {
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}