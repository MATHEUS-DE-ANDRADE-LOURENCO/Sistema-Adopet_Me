package com.adopetme.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.annotation.Nonnull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.slf4j.Logger; // 🚨 NOVO IMPORT
import org.slf4j.LoggerFactory; // 🚨 NOVO IMPORT

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // 🚨 1. Declaração do Logger
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService customUserDetailsService;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, CustomUserDetailsService customUserDetailsService) {
        this.tokenProvider = tokenProvider;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @Nonnull HttpServletRequest request,
            @Nonnull HttpServletResponse response,
            @Nonnull FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt)) {
                // Log: mostre apenas o início do token por segurança
                logger.info("Token JWT extraído com sucesso. Início: {}", jwt.substring(0, Math.min(jwt.length(), 15)));
            } else {
                logger.debug("Token JWT não encontrado no cabeçalho Authorization.");
            }

            // 3. Validação e Autenticação
            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {

                String email = tokenProvider.getEmailFromJWT(jwt);
                logger.info("Autenticando usuário: {}", email); // Novo log de autenticação

                UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

                // Cria o objeto de Autenticação e o define no contexto do Spring Security
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            // Log de erro no filtro. O tokenProvider já loga a causa exata (Expired, Malformed, etc.)
            logger.error("Erro no processo de autenticação JWT: {}", ex.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    // Método auxiliar para extrair o JWT do header Authorization (já estava robusto)
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (bearerToken != null) {
            logger.debug("Valor Bruto do Header Authorization: {}", bearerToken);
            String trimmedToken = bearerToken.trim();
            if (trimmedToken.toLowerCase().startsWith("bearer ")) {
                return trimmedToken.substring(7);
            }
        }
        return null;
    }
}