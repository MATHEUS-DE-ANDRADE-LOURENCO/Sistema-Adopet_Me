package com.adopetme.dataloaders;

import com.adopetme.models.User;
import com.adopetme.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; 

@Configuration
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder; 

    public DataLoader(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    public void run(String... args) {

        if (userRepository.findByEmail("admin@adopetme.com").isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@adopetme.com");
            admin.setLogin("admin"); 
            admin.setNome("Admin");   
            admin.setSenha(bCryptPasswordEncoder.encode("admin123"));
            admin.setTipoUsuario("ADMIN");
            userRepository.save(admin);
        }
    }
}