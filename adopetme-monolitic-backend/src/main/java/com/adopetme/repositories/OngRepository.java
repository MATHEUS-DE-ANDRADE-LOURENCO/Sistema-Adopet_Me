package com.adopetme.repositories;

import com.adopetme.models.Ong;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OngRepository extends JpaRepository<Ong, Integer> {
    // Por enquanto, não precisamos de métodos customizados aqui.
}