package com.adopetme.repositories;

import com.adopetme.models.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, Integer> {
    @Query("SELECT p FROM Pet p " + 
           "WHERE LOWER(p.nome) LIKE LOWER(CONCAT('%', :query, '%')) " + 
           "OR LOWER(p.especie) LIKE LOWER(CONCAT('%', :query, '%'))") 
    List<Pet> searchPets(@Param("query") String query); 
    
}
