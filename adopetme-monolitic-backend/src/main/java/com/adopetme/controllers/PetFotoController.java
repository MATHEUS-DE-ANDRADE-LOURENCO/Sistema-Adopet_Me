package com.adopetme.controllers;

import com.adopetme.models.Pet;
import com.adopetme.models.PetFoto;
import com.adopetme.repositories.PetFotoRepository;
import com.adopetme.repositories.PetRepository;
import com.adopetme.services.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "*")
public class PetFotoController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private PetFotoRepository petFotoRepository;

    @PostMapping("/{petId}/upload-photo")
    public ResponseEntity<?> uploadPetPhoto(
            @PathVariable Integer petId,
            @RequestParam("file") MultipartFile file
    ) {
        // (Em um sistema real, verificaríamos se a ONG logada é dona do pet)

        try {
            // 1. Encontra o Pet no banco
            Pet pet = petRepository.findById(petId)
                    .orElseThrow(() -> new RuntimeException("Pet não encontrado com ID: " + petId));

            // 2. Salva o arquivo no disco
            String fileUrl = fileStorageService.saveFile(file);

            // 3. Cria a nova entidade PetFoto
            PetFoto novaFoto = new PetFoto();
            novaFoto.setPet(pet);
            novaFoto.setUrl(fileUrl);

            // 4. Verifica se deve ser a foto principal
            // Se o pet não tiver NENHUMA foto ainda, esta se torna a principal
            long totalFotos = petFotoRepository.countByPet(pet);
            if (totalFotos == 0) {
                novaFoto.setFtPrincipal(true);
            } else {
                novaFoto.setFtPrincipal(false);
            }
            
            // 5. Salva a foto no banco
            petFotoRepository.save(novaFoto);
            
            // 6. Retorna a URL da foto
            return ResponseEntity.ok(Map.of("fotoUrl", fileUrl));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Falha no upload da foto: " + e.getMessage());
        }
    }
}