package com.adopetme.controllers;

import com.adopetme.models.Ong; // Usamos o modelo ONG (inferido)
import com.adopetme.repositories.OngRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/ongs")
public class OngController {

    @Autowired
    private OngRepository ongRepository;

    // 📝 Funcionalidade 1: Registrar Nova ONG
    @PostMapping
    public ResponseEntity<Ong> createOng(@RequestBody Ong ong) {
        // O banco de dados garante que o EMAIL é UNIQUE e NOT NULL [13]
        Ong savedOng = ongRepository.save(ong);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOng);
    }

    // 📖 Funcionalidade 2: Buscar ONG por ID (Para exibir o perfil da ONG)
    @GetMapping("/{id}")
    public ResponseEntity<Ong> getOngById(@PathVariable Integer id) {
        Optional<Ong> ong = ongRepository.findById(id);
        
        if (ong.isPresent()) {
            return ResponseEntity.ok(ong.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // ❌ Funcionalidade 3: Deletar ONG
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOng(@PathVariable Integer id) {
        if (!ongRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        // Se a ONG for deletada, o banco de dados trata as chaves estrangeiras:
        // - PETS relacionados são deletados (ON DELETE CASCADE) [14].
        // - USUARIOS relacionados têm seu ID_ONG zerado (ON DELETE SET NULL) [12].
        // - ONG_FOTO relacionadas são deletadas (ON DELETE CASCADE) [14].
        ongRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}