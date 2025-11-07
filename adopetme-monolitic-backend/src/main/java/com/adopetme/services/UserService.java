package com.adopetme.services;

import com.adopetme.models.User;
import com.adopetme.repositories.UserRepository;
// É melhor injetar a interface genérica PasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Injetando a interface

    // Injete o encoder para gerar uma senha fake (necessário para UserDetails)
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User saveOrUpdateOAuth2User(String email) {
        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            return existingUser.get();
        } else {
            // Se for um novo usuário do Google, crie e salve ele
            User newUser = new User();
            newUser.setEmail(email);
            
            newUser.setLogin(email); 
            newUser.setNome(email.split("@")[0]); // Pega o nome (ex: "danilo")
            newUser.setSenha(passwordEncoder.encode("OAUTH2_USER_NO_PASSWORD_" + email)); // Era setPassword
            newUser.setTipoUsuario("USER"); // Era setRole
            
            return userRepository.save(newUser);
        }
    }
}