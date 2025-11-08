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
                        // MUDANÇA AQUI:
                        // Liberar listagem (pets) e detalhes (pets/**) para todos
                        // ==========================================================
                        .requestMatchers(HttpMethod.GET, "/api/pets", "/api/pets/**").permitAll() 
                        
                        // 4. PROTEGER registro de pets (POST) apenas para ADMIN_ONG
                        .requestMatchers(HttpMethod.POST, "/api/pets/register").hasRole("ADMIN_ONG") 
                        
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