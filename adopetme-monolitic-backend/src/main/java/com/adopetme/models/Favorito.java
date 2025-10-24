package com.adopetme.models;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.Objects;

@Entity
@Table(name = "FAVORITOS",
       uniqueConstraints = @UniqueConstraint(columnNames = {"id_user", "id_pet"}, name = "uq_user_pet_favorito"))
public class Favorito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user", nullable = false, foreignKey = @ForeignKey(name = "fk_favorito_usuario"))
    private User usuario; // Alterado de Usuario para User

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pet", nullable = false, foreignKey = @ForeignKey(name = "fk_favorito_pet"))
    private Pet pet;

    @Column(name = "dt_favorito")
    private OffsetDateTime dtFavorito;

    // Construtor padrão (requerido pelo JPA)
    public Favorito() {
    }

    @PrePersist
    public void prePersist() {
        if (dtFavorito == null) {
            dtFavorito = OffsetDateTime.now();
        }
    }

    // Getters e Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getUsuario() { // Alterado de Usuario para User
        return usuario;
    }

    public void setUsuario(User usuario) { // Alterado de Usuario para User
        this.usuario = usuario;
    }

    public Pet getPet() {
        return pet;
    }

    public void setPet(Pet pet) {
        this.pet = pet;
    }

    public OffsetDateTime getDtFavorito() {
        return dtFavorito;
    }

    public void setDtFavorito(OffsetDateTime dtFavorito) {
        this.dtFavorito = dtFavorito;
    }

    // Métodos equals e hashCode baseados no ID
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Favorito favorito = (Favorito) o;
        return Objects.equals(id, favorito.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    // Método toString (Corrigido para usar usuario.getId())
    @Override
    public String toString() {
        return "Favorito{" +
                "id=" + id +
                ", usuarioId=" + (usuario != null ? usuario.getId() : "null") +
                ", petId=" + (pet != null ? pet.getId() : "null") +
                ", dtFavorito=" + dtFavorito +
                '}';
    }
}
