package com.adopetme.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import org.apache.commons.io.FilenameUtils; // Import da dependência que adicionamos

@Service
public class FileStorageService {

    // Define o caminho de upload. "./uploads"
    private final Path uploadPath = Paths.get("uploads");

    public FileStorageService() {
        try {
            // Cria o diretório "uploads" se ele não existir
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível criar o diretório de uploads", e);
        }
    }

    /**
     * Salva o arquivo e retorna o caminho relativo para o servidor.
     * @param file O arquivo enviado (MultipartFile)
     * @return O caminho relativo (ex: /uploads/nome-unico.png)
     */
    public String saveFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Falha ao salvar arquivo vazio.");
        }

        // Gera um nome de arquivo único para evitar colisões
        String extension = FilenameUtils.getExtension(file.getOriginalFilename());
        String uniqueFileName = UUID.randomUUID().toString() + "." + extension;

        try (InputStream inputStream = file.getInputStream()) {
            Path filePath = this.uploadPath.resolve(uniqueFileName);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Retorna o caminho que o frontend usará para acessar a imagem
            return "/uploads/" + uniqueFileName;
        } catch (IOException e) {
            throw new RuntimeException("Falha ao salvar o arquivo: " + uniqueFileName, e);
        }
    }
}