package com.adopetme.security;

import io.jsonwebtoken.io.Decoders;
import com.adopetme.config.AppProperties; // Importe a classe que acabamos de criar
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);
    private final AppProperties appProperties;

    public JwtTokenProvider(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    // Converte a chave secreta em um objeto Key
    private Key key() {
        String jwtSecret = appProperties.getJwt().getSecret();
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String getEmailFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token).getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(authToken);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("JWT Inválido...", e);
        } catch (ExpiredJwtException e) {
            logger.error("JWT Expirado...", e);
        } catch (UnsupportedJwtException e) {
            logger.error("JWT Não Suportado...", e);
        } catch (IllegalArgumentException e) {
            logger.error("Claims JWT vazias...", e);
        }
        return false;
    }

    /**
     * Gera um JWT para um determinado usuário (identificado pelo email).
     */
    public String generateToken(String email) {
        Date now = new Date();

        // Acessa o tempo de expiração da AppProperties
        long expirationTime = appProperties.getJwt().getExpirationInMs();
        Date expiryDate = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
                .setSubject(email) // O corpo do token conterá o email como 'Subject'
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(key(), SignatureAlgorithm.HS512)
                .compact();
    }
}