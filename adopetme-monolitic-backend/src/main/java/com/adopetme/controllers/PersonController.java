package com.adopetme.controllers;

import com.adopetme.models.PersonModel;
import com.adopetme.services.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/person")
public class PersonController {

    private final PersonService personService;

    @Autowired
    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @GetMapping("/data")
    public ResponseEntity<PersonModel> getPersonData() {
        PersonModel person = personService.getPersonData();
        return ResponseEntity.ok(person);
    }
}
