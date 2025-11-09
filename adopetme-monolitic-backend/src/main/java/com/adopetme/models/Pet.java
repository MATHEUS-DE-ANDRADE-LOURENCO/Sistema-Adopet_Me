package com.adopetme.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "PETS")
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "id_ong", nullable = false, foreignKey = @ForeignKey(name = "fk_pet_ong"))
    private Ong ong;

    @Column(nullable = false)
    private String nome;

    private String ninhada;
    private String especie;
    private String sexo;
    private Integer idade;
    private Boolean castracao;

    @Column(name = "dt_nascimento")
    private LocalDate dtNascimento;

    private String descricao;
    private String status;

    @Column(name = "dt_cadastro")
    private OffsetDateTime dtCadastro;

    // ==========================================================
    // NOVO CAMPO TRANSIENTE - URL da foto principal
    // ==========================================================
    @Transient
    private String fotoUrl; // não é salvo no banco, apenas usado para exibição no JSON

    @JsonIgnore
    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PetFoto> fotos;

    @JsonIgnore
    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Favorito> favoritos;

    public Pet() {}

    @PrePersist
    public void prePersist() {
        if (dtCadastro == null) {
            dtCadastro = OffsetDateTime.now();
        }
    }

    // ==========================================================
    // GETTERS E SETTERS
    // ==========================================================
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Ong getOng() { return ong; }
    public void setOng(Ong ong) { this.ong = ong; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getNinhada() { return ninhada; }
    public void setNinhada(String ninhada) { this.ninhada = ninhada; }

    public String getEspecie() { return especie; }
    public void setEspecie(String especie) { this.especie = especie; }

    public String getSexo() { return sexo; }
    public void setSexo(String sexo) { this.sexo = sexo; }

    public Integer getIdade() { return idade; }
    public void setIdade(Integer idade) { this.idade = idade; }

    public Boolean getCastracao() { return castracao; }
    public void setCastracao(Boolean castracao) { this.castracao = castracao; }

    public LocalDate getDtNascimento() { return dtNascimento; }
    public void setDtNascimento(LocalDate dtNascimento) { this.dtNascimento = dtNascimento; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public OffsetDateTime getDtCadastro() { return dtCadastro; }
    public void setDtCadastro(OffsetDateTime dtCadastro) { this.dtCadastro = dtCadastro; }

    public List<PetFoto> getFotos() { return fotos; }
    public void setFotos(List<PetFoto> fotos) { this.fotos = fotos; }

    public List<Favorito> getFavoritos() { return favoritos; }
    public void setFavoritos(List<Favorito> favoritos) { this.favoritos = favoritos; }

    public String getFotoUrl() { return fotoUrl; }
    public void setFotoUrl(String fotoUrl) { this.fotoUrl = fotoUrl; }

    // ==========================================================
    // EQUALS, HASHCODE E TOSTRING
    // ==========================================================
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Pet pet = (Pet) o;
        return Objects.equals(id, pet.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Pet{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", especie='" + especie + '\'' +
                ", status='" + status + '\'' +
                ", fotoUrl='" + fotoUrl + '\'' +
                '}';
    }
}
