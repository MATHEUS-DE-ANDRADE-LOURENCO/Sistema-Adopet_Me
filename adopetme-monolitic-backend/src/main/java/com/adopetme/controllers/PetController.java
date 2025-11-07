package com.adopetme.controllers;

import com.adopetme.models.Pet;
import com.adopetme.repositories.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    @Autowired
    private PetRepository petRepository;

   
    @GetMapping("/{id}")
    public ResponseEntity<Pet> getPetById(@PathVariable Integer id) {
        Optional<Pet> pet = petRepository.findById(id);
        
        if (pet.isPresent()) {
            return ResponseEntity.ok(pet.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

 
    @GetMapping("/search")
    public ResponseEntity<List<Pet>> searchPets(@RequestParam(required = false) String q) {
        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.ok(petRepository.findAll());
        }
        
        List<Pet> results = petRepository.searchPets(q);
        return ResponseEntity.ok(results);
    }

    @PostMapping
    public ResponseEntity<Pet> createPet(@RequestBody Pet pet) {
        Pet savedPet = petRepository.save(pet);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPet);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Pet> updatePet(@PathVariable Integer id, @RequestBody Pet petDetails) {
        if (!petRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        petDetails.setId(id); 
        Pet updatedPet = petRepository.save(petDetails);
        return ResponseEntity.ok(updatedPet);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePet(@PathVariable Integer id) {
        if (!petRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
         petRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}