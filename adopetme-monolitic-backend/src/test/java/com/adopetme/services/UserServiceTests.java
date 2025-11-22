package com.adopetme.services;

import com.adopetme.models.User;
import com.adopetme.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void deveRetornarUsuarioExistenteQuandoEncontrado() {
        String email = "maria@example.com";
        User existing = new User();
        existing.setEmail(email);
        existing.setLogin(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(existing));

        User result = userService.saveOrUpdateOAuth2User(email);

        assertNotNull(result);
        assertEquals(existing, result);
        verify(userRepository, times(1)).findByEmail(email);
        verify(userRepository, never()).save(any());
    }

    @Test
    void deveCriarENovaUsuarioQuandoNaoExistir() {
        String email = "joao.silva@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encoded-password");

        // Simula o comportamento do save retornando o mesmo objeto salvo
        doAnswer(invocation -> invocation.getArgument(0)).when(userRepository).save(any(User.class));

        User saved = userService.saveOrUpdateOAuth2User(email);

        assertNotNull(saved);
        assertEquals(email, saved.getEmail());
        assertEquals(email, saved.getLogin());
        assertEquals("joao.silva", saved.getNome());
        assertEquals("encoded-password", saved.getSenha());
        assertEquals("USER", saved.getTipoUsuario());

        verify(userRepository, times(1)).findByEmail(email);
        verify(passwordEncoder, times(1)).encode(startsWith("OAUTH2_USER_NO_PASSWORD_"));
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void devePropagarExcecaoSeSaveFalhar() {
        String email = "falha@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenThrow(new RuntimeException("DB offline"));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            userService.saveOrUpdateOAuth2User(email);
        });

        assertEquals("DB offline", ex.getMessage());
        verify(userRepository, times(1)).findByEmail(email);
        verify(userRepository, times(1)).save(any(User.class));
    }
}
