package com.adopetme.controllers;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoritoController {

    @PostMapping
    public ResponseEntity<Void> addFavorite(@RequestParam Integer userId, @RequestParam Integer petId) {

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


    @DeleteMapping
    public ResponseEntity<Void> removeFavorite(@RequestParam Integer userId, @RequestParam Integer petId) {
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/{userId}")
    public ResponseEntity<List<?>> getFavoritesByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(List.of("Simulação de Pet 1", "Simulação de Pet 2")); // Simulação de retorno
    }
}