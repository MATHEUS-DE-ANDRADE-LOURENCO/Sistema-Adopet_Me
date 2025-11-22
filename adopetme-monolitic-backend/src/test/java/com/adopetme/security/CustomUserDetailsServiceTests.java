package com.adopetme.security;

import com.adopetme.models.User;
import com.adopetme.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CustomUserDetailsServiceTests {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void deveCarregarUserDetailsQuandoUsuarioExistir() {
        String email = "ana@example.com";
        User user = new User();
        user.setEmail(email);
        user.setSenha("senha-criptografada");
        user.setTipoUsuario("USER");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

        assertNotNull(userDetails);
        assertEquals(email, userDetails.getUsername());
        assertEquals("senha-criptografada", userDetails.getPassword());
        assertFalse(userDetails.getAuthorities().isEmpty());
    }

    @Test
    void deveLancarQuandoUsuarioNaoExistir() {
        String email = "naoexiste@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> {
            customUserDetailsService.loadUserByUsername(email);
        });
    }
}
