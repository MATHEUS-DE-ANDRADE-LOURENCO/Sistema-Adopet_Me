package com.adopetme.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import com.adopetme.services.Calculator;

@RestController
@RequestMapping("/calculator")
public class CalculatorController {
    @Autowired
    private Calculator calculatorService;

    @GetMapping("/soma/{numberOne}/{numberTwo}")
    public double soma(@PathVariable double numberOne, @PathVariable double numberTwo) {
        return calculatorService.somar(numberOne, numberTwo);
    }

    @GetMapping("/subtracao/{numberOne}/{numberTwo}")
    public double subtracao(@PathVariable double numberOne, @PathVariable double numberTwo) {
        return calculatorService.subtrair(numberOne, numberTwo);
    }

}

