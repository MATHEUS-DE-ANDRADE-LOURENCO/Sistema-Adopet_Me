package com.adopetme.repositories;

import com.adopetme.models.Favorito;
import com.adopetme.models.Pet;
import com.adopetme.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // <-- ADICIONE ESTA IMPORTAÇÃO

import java.util.List;
import java.util.Optional;

public interface FavoritoRepository extends JpaRepository<Favorito, Integer> {

    // Encontra todos os favoritos de um usuário específico
    List<Favorito> findAllByUsuario(User usuario);

    // ==========================================================
    // NOVA CONSULTA (CORREÇÃO PARA LAZY LOADING)
    // ==========================================================
    // Esta consulta busca os Favoritos e já "puxa" (JOIN FETCH)
    // os dados do Pet associado, evitando a LazyInitializationException.
    @Query("SELECT f FROM Favorito f JOIN FETCH f.pet WHERE f.usuario = :usuario")
    List<Favorito> findAllWithPetByUsuario(User usuario);
    // ==========================================================

    // Encontra um favorito específico pela combinação de usuário e pet
    Optional<Favorito> findByUsuarioAndPet(User usuario, Pet pet);

    // Verifica se um favorito existe
    boolean existsByUsuarioAndPet(User usuario, Pet pet);
}