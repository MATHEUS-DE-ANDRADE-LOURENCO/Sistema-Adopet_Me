// adopetme-monolitic-backend/src/main/java/com/adopetme/repositories/PetRepository.java
package com.adopetme.repositories;

import com.adopetme.models.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetRepository extends JpaRepository<Pet, Integer> {
    // Você pode adicionar buscas customizadas aqui no futuro, como findByEspecie, etc.
}