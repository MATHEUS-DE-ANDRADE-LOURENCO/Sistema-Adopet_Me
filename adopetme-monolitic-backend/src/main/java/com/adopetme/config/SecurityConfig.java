// adopetme-monolitic-backend/src/main/java/com/adopetme/config/SecurityConfig.java
package com.adopetme.config;

import com.adopetme.security.CustomUserDetailsService;
import com.adopetme.security.OAuth2AuthenticationSuccessHandler;
import com.adopetme.security.JwtAuthenticationFilter;
import com.adopetme.security.JwtTokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // Importar HttpMethod
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(
            OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler,
            JwtTokenProvider jwtTokenProvider,
            CustomUserDetailsService customUserDetailsService) {
        this.oAuth2AuthenticationSuccessHandler = oAuth2AuthenticationSuccessHandler;
        this.jwtTokenProvider = jwtTokenProvider;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtTokenProvider, customUserDetailsService);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable))
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/auth/**",
                                "/oauth2/**",
                                "/login/oauth2/**",
                                "/h2-console/**",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/api/auth/**" // Liberar /api/auth
                        ).permitAll()
                        
                        // ==========================================================
                        // CORREÇÃO DO BUG DE CORS (PREFLIGHT) APLICADA AQUI
                        // ==========================================================
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() 
                        // (Da etapa anterior)
                        .requestMatchers(HttpMethod.POST, "/api/report").permitAll() 
                        
                        // ==========================================================

                        // --- PERMISSÃO PARA VER FOTOS ---
                        .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()
                        
                        
                        // Liberar listagem (pets) e detalhes (pets/**) para todos
                        .requestMatchers(HttpMethod.GET, "/api/pets", "/api/pets/**").permitAll() 
                        
                        // PROTEGER registro de pets (POST) apenas para ADMIN_ONG
                        .requestMatchers(HttpMethod.POST, "/api/pets/register").hasRole("ADMIN_ONG") 
                        
                        // --- NOVAS REGRAS DE GERENCIAMENTO ---
                        // Gerenciamento de Pets (PUT, DELETE, /my-ong)
                        .requestMatchers(HttpMethod.GET, "/api/pets/my-ong").hasRole("ADMIN_ONG")
                        .requestMatchers(HttpMethod.PUT, "/api/pets/**").hasRole("ADMIN_ONG")
                        .requestMatchers(HttpMethod.DELETE, "/api/pets/**").hasRole("ADMIN_ONG")
                        
                        // Gerenciamento da ONG (somente /api/ong/me)
                        .requestMatchers("/api/ong/me").hasRole("ADMIN_ONG")
                        // --- FIM DAS NOVAS REGRAS ---
                        
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(endpoint -> endpoint
                                .baseUri("/oauth2/authorization")
                        )
                        .successHandler(oAuth2AuthenticationSuccessHandler)
                );

        return http.build();
    }
}