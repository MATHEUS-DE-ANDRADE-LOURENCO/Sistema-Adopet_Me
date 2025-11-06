package com.adopetme.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "USUARIO") // A tabela no DB ainda se chama USUARIO
@Getter
@Setter
@NoArgsConstructor
public class User implements UserDetails { // Classe Renomeada

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // Usando Integer como chave primária

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ong")
    private Ong ong;

    @Column(nullable = false, unique = true)
    private String login;

    @Column(nullable = false)
    private String senha;

    @Column(nullable = false)
    private String nome;

    private String sobrenome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(unique = true)
    private String cpf;

    private String endereco;
    private String telefone;

    @Column(name = "tipo_user", nullable = false)
    private String tipoUsuario;

    @Column(name = "dt_cadastro")
    private OffsetDateTime dtCadastro;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Favorito> favoritos;

    @PrePersist
    public void prePersist() {
        if (dtCadastro == null) {
            dtCadastro = OffsetDateTime.now();
        }
    }

    // ==========================================================
    // Implementação dos Métodos do UserDetails
    // ==========================================================

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Usa o campo 'tipoUsuario' como a ROLE.
        // O prefixo "ROLE_" é uma convenção do Spring Security.
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_" + this.tipoUsuario.toUpperCase()));
    }

    @Override
    public String getPassword() {
        // Retorna o campo 'senha'
        return this.senha;
    }

    @Override
    public String getUsername() {
        // Usa o 'email' como o nome de usuário para login.
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    // Métodos equals e hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o; // Renomeado
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
