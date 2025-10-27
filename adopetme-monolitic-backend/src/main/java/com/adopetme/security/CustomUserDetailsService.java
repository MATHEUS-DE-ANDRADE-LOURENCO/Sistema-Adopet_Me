package com.adopetme.security;

import com.adopetme.repositories.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Este método é usado pelo Spring Security para carregar o usuário por nome (email)
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Usa o repositório existente para buscar o UserModel
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Usuário não encontrado com e-mail: " + email)
                );
    }
}