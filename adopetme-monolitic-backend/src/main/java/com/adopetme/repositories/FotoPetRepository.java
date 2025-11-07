package com.adopetme.repositories;

import com.adopetme.models.PetFoto; 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface FotoPetRepository extends JpaRepository<PetFoto, Integer> {

    List<PetFoto> findByIdPet(Integer idPet);
    List<PetFoto> findByIdPetAndFtPrincipalIsTrue(Integer idPet);
    
}