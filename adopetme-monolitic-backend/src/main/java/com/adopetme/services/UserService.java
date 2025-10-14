package com.adopetme.services;

import com.adopetme.models.UserModel;
import com.adopetme.repositories.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    // Injete o encoder para gerar uma senha fake (necessário para UserDetails)
    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserModel saveOrUpdateOAuth2User(String email) {
        Optional<UserModel> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            // Se o usuário já existe, retorne ele. Você pode adicionar lógica de atualização aqui se precisar.
            return existingUser.get();
        } else {
            // Se for um novo usuário do Google, crie e salve ele
            UserModel newUser = new UserModel();
            newUser.setEmail(email);
            // OAuth2 não tem senha, mas o UserModel/UserDetails exige. Crie uma senha fake e longa.
            newUser.setPassword(passwordEncoder.encode("OAUTH2_USER_NO_PASSWORD_" + email));
            newUser.setRole("USER"); // Define o Role padrão
            return userRepository.save(newUser);
        }
    }
}