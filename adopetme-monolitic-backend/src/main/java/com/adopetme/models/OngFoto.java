package com.adopetme.models;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.Objects;

@Entity
@Table(name = "ONG_FOTO")
public class OngFoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ong", nullable = false, foreignKey = @ForeignKey(name = "fk_ongfoto_ong"))
    private Ong ong;

    @Column(nullable = false)
    private String url;

    @Column(name = "dt_criacao")
    private OffsetDateTime dtCriacao;

    @Column(name = "ft_logo")
    private Boolean ftLogo = false;

    public OngFoto() {
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

    public Ong getOng() {
        return ong;
    }

    public void setOng(Ong ong) {
        this.ong = ong;
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

    public Boolean getFtLogo() {
        return ftLogo;
    }

    public void setFtLogo(Boolean ftLogo) {
        this.ftLogo = ftLogo;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OngFoto ongFoto = (OngFoto) o;
        return Objects.equals(id, ongFoto.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "OngFoto{" +
                "id=" + id +
                ", url='" + url + '\'' +
                ", ftLogo=" + ftLogo +
                '}';
    }
}