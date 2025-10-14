package com.adopetme.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app")
@Getter
@Setter
public class AppProperties {

    private final Jwt jwt = new Jwt();

    // Sub-classe para agrupar as propriedades OAuth2
    private final OAuth2 oauth2 = new OAuth2();

    @Setter
    @Getter
    public static class Jwt {
        // Getters e Setters
        private String secret;
        private long expirationInMs;

    }

    @Setter
    @Getter
    public static class OAuth2 {
        // Getters e Setters
        private String authorizedRedirectUris;
        private String allowedOrigins;

    }

}