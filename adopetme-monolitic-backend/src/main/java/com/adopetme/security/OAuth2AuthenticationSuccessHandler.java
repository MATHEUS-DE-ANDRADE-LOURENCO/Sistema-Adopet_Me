package com.adopetme.security;

import com.adopetme.config.AppProperties;
// 🚨 NOVO IMPORT: Importe o UserService
import com.adopetme.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import java.io.IOException;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider tokenProvider;
    private final AppProperties appProperties;
    // 🚨 NOVO: Adicione o UserService
    private final UserService userService;

    // 🚨 Construtor Atualizado: Injete o UserService
    public OAuth2AuthenticationSuccessHandler(
            JwtTokenProvider tokenProvider,
            AppProperties appProperties,
            UserService userService) {
        this.tokenProvider = tokenProvider;
        this.appProperties = appProperties;
        this.userService = userService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // O e-mail é o identificador principal do usuário vindo do Google
        String email = oAuth2User.getAttribute("email");

        // 🚨 LÓGICA DE NEGÓCIO: Salva ou Atualiza o usuário no banco de dados
        // Isso garante que todo usuário autenticado via Google tenha um registro em sua tabela 'users'.
        userService.saveOrUpdateOAuth2User(email);

        // 1. Gera o JWT usando o provedor que criamos
        String token = tokenProvider.generateToken(email);

        // 2. Constrói a URL de redirecionamento (http://localhost:3030/auth/oauth2/redirect?token=JWT_AQUI)
        String redirectUri = appProperties.getOauth2().getAuthorizedRedirectUris();
        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("token", token)
                .build().toUriString();

        // 3. Redireciona o cliente para o Frontend
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}