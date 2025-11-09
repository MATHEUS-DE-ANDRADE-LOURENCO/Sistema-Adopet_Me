package com.adopetme.controllers;

import com.adopetme.models.Ong;
import com.adopetme.models.User;
import com.adopetme.repositories.OngRepository;
import com.adopetme.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ong")
@CrossOrigin(origins = "*")
public class OngController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OngRepository ongRepository;

    /**
     * Pega os detalhes da ONG associada ao usuário (admin) logado.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMyOngDetails(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Autenticação necessária.");
        }

        try {
            User adminOngUser = findUserByAuth(authentication);
            Ong ong = adminOngUser.getOng();
            
            if (ong == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não está associado a nenhuma ONG.");
            }
            
            return ResponseEntity.ok(ong);

        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    /**
     * Atualiza os detalhes da ONG associada ao usuário (admin) logado.
     * Recebemos um DTO 'Ong' mas só atualizamos os campos permitidos.
     */
    @PutMapping("/me")
    public ResponseEntity<?> updateMyOngDetails(@RequestBody Ong updatedOngData, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Autenticação necessária.");
        }

        try {
            User adminOngUser = findUserByAuth(authentication);
            // Busca a ONG original do banco
            Ong ong = adminOngUser.getOng();

            if (ong == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não está associado a nenhuma ONG.");
            }

            // Atualiza os campos permitidos
            ong.setNome(updatedOngData.getNome());
            ong.setEndereco(updatedOngData.getEndereco());
            ong.setResponsavel(updatedOngData.getResponsavel());
            ong.setTelefone(updatedOngData.getTelefone());
            ong.setTipo(updatedOngData.getTipo()); // 'tipo' é o 'tipo_ong'
            ong.setCidade(updatedOngData.getCidade());
            ong.setEstado(updatedOngData.getEstado());
            ong.setDescricao(updatedOngData.getDescricao());
            // Nota: O e-mail não é atualizado por aqui para evitar dessincronização com o User.
            
            Ong savedOng = ongRepository.save(ong);
            return ResponseEntity.ok(savedOng);

        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao atualizar ONG: " + e.getMessage());
        }
    }

    // Método auxiliar para buscar o usuário logado
    private User findUserByAuth(Authentication authentication) {
        String userEmail = authentication.getName();
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
    }
}