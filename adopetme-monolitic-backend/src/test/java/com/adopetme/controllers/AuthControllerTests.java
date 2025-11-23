package com.adopetme.controllers;

import com.adopetme.dtos.LoginRequest;
import com.adopetme.models.User;
import com.adopetme.repositories.OngRepository;
import com.adopetme.repositories.UserRepository;
import com.adopetme.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private OngRepository ongRepository;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    private AuthController authController;

    @BeforeEach
    void setup() {
        // cria a instância passando o passwordEncoder mock e injeta os demais mocks manualmente
        authController = new AuthController(passwordEncoder);
        org.springframework.test.util.ReflectionTestUtils.setField(authController, "userRepository", userRepository);
        org.springframework.test.util.ReflectionTestUtils.setField(authController, "ongRepository", ongRepository);
        org.springframework.test.util.ReflectionTestUtils.setField(authController, "jwtTokenProvider", jwtTokenProvider);
    }

    @Test
    void deveRetornar404QuandoUsuarioNaoExistir() {
        LoginRequest req = new LoginRequest();
        req.setEmail("x@example.com");
        req.setSenha("qualquer");

        when(userRepository.findByEmail(req.getEmail())).thenReturn(Optional.empty());

        ResponseEntity<?> resp = authController.login(req);

        assertEquals(404, resp.getStatusCodeValue());
        assertEquals("Usuário não encontrado...", resp.getBody());
    }

    @Test
    void deveRetornar401QuandoSenhaIncorreta() {
        LoginRequest req = new LoginRequest();
        req.setEmail("y@example.com");
        req.setSenha("senha-errada");

        User user = new User();
        user.setEmail(req.getEmail());
        user.setSenha("senha-hash");

        when(userRepository.findByEmail(req.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        ResponseEntity<?> resp = authController.login(req);

        assertEquals(401, resp.getStatusCodeValue());
        assertEquals("Senha incorreta...", resp.getBody());
    }

    @Test
    void deveRetornar200EAuthResponseQuandoLoginOK() {
        LoginRequest req = new LoginRequest();
        req.setEmail("z@example.com");
        req.setSenha("senha-correta");

        User user = new User();
        user.setEmail(req.getEmail());
        user.setSenha("senha-hash");

        when(userRepository.findByEmail(req.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(eq(req.getSenha()), anyString())).thenReturn(true);
        when(jwtTokenProvider.generateToken(req.getEmail())).thenReturn("token-123");

        ResponseEntity<?> resp = authController.login(req);

        assertEquals(200, resp.getStatusCodeValue());
        assertNotNull(resp.getBody());
        assertTrue(resp.getBody() instanceof AuthController.AuthResponse);

        AuthController.AuthResponse body = (AuthController.AuthResponse) resp.getBody();
        assertEquals("token-123", body.token);
        assertEquals("Login realizado com sucesso!", body.message);
    }
}
