package com.adopetme.controllers;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class TestControllerTests {

    private final TestController controller = new TestController();

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void deveRetornarInfoDoUsuarioQuandoAutenticado() {
        // Mock simples do SecurityContext com Authentication
        Authentication auth = new Authentication() {
            @Override
            public List<SimpleGrantedAuthority> getAuthorities() {
                return List.of(new SimpleGrantedAuthority("ROLE_USER"));
            }

            @Override
            public Object getCredentials() { return null; }

            @Override
            public Object getDetails() { return null; }

            @Override
            public Object getPrincipal() { return "principal"; }

            @Override
            public boolean isAuthenticated() { return true; }

            @Override
            public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException { }

            @Override
            public String getName() { return "usuario@example.com"; }
        };

        SecurityContext ctx = SecurityContextHolder.createEmptyContext();
        ctx.setAuthentication(auth);
        SecurityContextHolder.setContext(ctx);

        ResponseEntity<String> resp = controller.userAccess();

        assertEquals(200, resp.getStatusCodeValue());
        assertTrue(resp.getBody().contains("usuario@example.com"));
        assertTrue(resp.getBody().contains("ROLE_USER"));
    }
}
