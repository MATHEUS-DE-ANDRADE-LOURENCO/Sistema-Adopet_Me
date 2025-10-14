package com.adopetme.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PersonModel {
    private String nome;
    private String sobrenome;
    private int idade;
    private String cidade;

}
