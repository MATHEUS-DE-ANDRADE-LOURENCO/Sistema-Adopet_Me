package com.adopetme.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Mapeia a URL /uploads/** para a pasta "uploads" no disco
        // "file:uploads/" refere-se a uma pasta "uploads" na raiz do projeto
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}