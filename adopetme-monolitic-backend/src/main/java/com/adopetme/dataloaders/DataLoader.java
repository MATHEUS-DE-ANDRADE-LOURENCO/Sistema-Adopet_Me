package com.adopetme.dataloaders;

import com.adopetme.models.User;
import com.adopetme.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("admin@adopetme.com").isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@adopetme.com");
            admin.setLogin("admin");
            admin.setNome("Admin");
            admin.setSenha(passwordEncoder.encode("admin123"));
            admin.setTipoUsuario("ADMIN");
            userRepository.save(admin);
        }

        if (userRepository.findByEmail("tutor@adopetme.com").isEmpty()) {
            User tutor = new User();
            tutor.setEmail("tutor@adopetme.com");
            tutor.setLogin("tutor");
            tutor.setNome("Tutor de Teste");
            tutor.setSenha(passwordEncoder.encode("tutor123"));
            tutor.setTipoUsuario("USER");
            userRepository.save(tutor);
        }
    }
}
