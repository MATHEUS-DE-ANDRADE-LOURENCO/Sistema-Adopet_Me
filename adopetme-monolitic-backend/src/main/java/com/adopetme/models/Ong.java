package com.adopetme.models;

// --- IMPORT NECESSÁRIO ---
import com.fasterxml.jackson.annotation.JsonIgnore; 
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "ONG")
public class Ong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String nome;

    private String endereco;
    private String responsavel;
    private String telefone;

    @Column(name = "tipo_ong")
    private String tipo;

    @Column(nullable = false, unique = true)
    private String email;

    private String cidade;
    private String estado;
    private String descricao;

    @Column(name = "dt_registro")
    private OffsetDateTime dtRegistro;

    // --- CORREÇÃO 3 (O ERRO DO SEU ÚLTIMO LOG) ---
    @JsonIgnore // Impede que o Jackson serialize esta lista (evita LazyInitializationException)
    @OneToMany(mappedBy = "ong", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<User> usuarios;

    // --- CORREÇÃO 4 (PREVENTIVA, MESMO PROBLEMA) ---
    @JsonIgnore // Impede que o Jackson serialize esta lista (evita LazyInitializationException)
    @OneToMany(mappedBy = "ong", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pet> pets;

    @PrePersist
    public void prePersist() {
        if (dtRegistro == null) {
            dtRegistro = OffsetDateTime.now();
        }
    }

    // Getters e Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public String getResponsavel() { return responsavel; }
    public void setResponsavel(String responsavel) { this.responsavel = responsavel; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public OffsetDateTime getDtRegistro() { return dtRegistro; }
    public void setDtRegistro(OffsetDateTime dtRegistro) { this.dtRegistro = dtRegistro; }

    public List<User> getUsuarios() { return usuarios; }
    public void setUsuarios(List<User> usuarios) { this.usuarios = usuarios; }

    public List<Pet> getPets() { return pets; }
    public void setPets(List<Pet> pets) { this.pets = pets; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Ong)) return false;
        Ong ong = (Ong) o;
        return Objects.equals(id, ong.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}