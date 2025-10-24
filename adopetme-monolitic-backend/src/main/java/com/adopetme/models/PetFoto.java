package com.adopetme.models;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.Objects;

@Entity
@Table(name = "PET_FOTOS")
public class PetFoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pet", nullable = false, foreignKey = @ForeignKey(name = "fk_petfoto_pet"))
    private Pet pet;

    @Column(nullable = false)
    private String url;

    @Column(name = "dt_criacao")
    private OffsetDateTime dtCriacao;

    @Column(name = "ft_principal")
    private Boolean ftPrincipal = false;

    public PetFoto() {
    }

    @PrePersist
    public void prePersist() {
        if (dtCriacao == null) {
            dtCriacao = OffsetDateTime.now();
        }
    }

    // Getters e Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Pet getPet() {
        return pet;
    }

    public void setPet(Pet pet) {
        this.pet = pet;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public OffsetDateTime getDtCriacao() {
        return dtCriacao;
    }

    public void setDtCriacao(OffsetDateTime dtCriacao) {
        this.dtCriacao = dtCriacao;
    }

    public Boolean getFtPrincipal() {
        return ftPrincipal;
    }

    public void setFtPrincipal(Boolean ftPrincipal) {
        this.ftPrincipal = ftPrincipal;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PetFoto petFoto = (PetFoto) o;
        return Objects.equals(id, petFoto.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "PetFoto{" +
                "id=" + id +
                ", url='" + url + '\'' +
                ", ftPrincipal=" + ftPrincipal +
                '}';
    }
}