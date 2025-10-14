package com.adopetme.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/calculator")
public class CalculatorController {
    @GetMapping("/soma/{numberOne}/{numberTwo}")
    public double soma(@PathVariable int numberOne, @PathVariable int numberTwo) {
        return numberOne + numberTwo;
    }
}