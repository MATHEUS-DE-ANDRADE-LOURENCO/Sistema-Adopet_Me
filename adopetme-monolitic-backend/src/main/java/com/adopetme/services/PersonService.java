package com.adopetme.services;

import com.adopetme.models.PersonModel;
import org.springframework.stereotype.Service;

@Service
public class PersonService {

    public PersonModel getPersonData() {
        // Dados de exemplo — você pode alterar para buscar de um banco de dados
        return new PersonModel("João", "Silva", 30, "São Paulo");
    }
}
