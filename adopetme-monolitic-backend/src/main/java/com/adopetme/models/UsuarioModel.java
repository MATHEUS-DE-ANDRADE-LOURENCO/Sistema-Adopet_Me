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
@Table(name = "USUARIO")
@Getter
@Setter
@NoArgsConstructor
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ong")
    private Ong ong;

    @Column(nullable = false, unique = true)
    private String login;

    @Column(nullable = false)
    private String senha; // Usaremos este campo para o getPassword()

    @Column(nullable = false)
    private String nome;

    private String sobrenome;

    @Column(nullable = false, unique = true)
    private String email; // Usaremos este campo para o getUsername()

    @Column(unique = true)
    private String cpf;

    private String endereco;
    private String telefone;

    @Column(name = "tipo_user", nullable = false)
    private String tipoUsuario; // Usaremos este campo para a ROLE

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

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Usa o campo 'tipoUsuario' como a ROLE.
        // O prefixo "ROLE_" é uma convenção do Spring Security.
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_" + this.tipoUsuario.toUpperCase()));
    }

    @Override
    public String getPassword() {
        // Retorna o campo 'senha' da sua classe Usuario.
        return this.senha;
    }

    @Override
    public String getUsername() {
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Usuario usuario = (Usuario) o;
        return Objects.equals(id, usuario.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}