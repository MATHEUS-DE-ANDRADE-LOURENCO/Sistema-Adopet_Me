package com.adopetme.repositories;

import com.adopetme.models.Pet;
import com.adopetme.models.PetFoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PetFotoRepository extends JpaRepository<PetFoto, Integer> {

    // Busca a primeira foto de um pet que esteja marcada como "principal"
    Optional<PetFoto> findFirstByPetAndFtPrincipal(Pet pet, Boolean ftPrincipal);
    
    // Conta quantas fotos um pet tem
    long countByPet(Pet pet);
}