package com.adopetme.repositories;

import com.adopetme.models.OngFoto; 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FotoOngRepository extends JpaRepository<OngFoto, Integer> {
    
    List<OngFoto> findByIdOng(Integer idOng);
    Optional<OngFoto> findByIdOngAndFtLogoIsTrue(Integer idOng);
    
}