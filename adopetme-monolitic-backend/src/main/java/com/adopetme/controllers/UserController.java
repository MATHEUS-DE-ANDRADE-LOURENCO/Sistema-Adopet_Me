package com.adopetme.controllers;

import com.adopetme.models.User;
import com.adopetme.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserDetails(@PathVariable Integer id) {
        Optional<User> user = userRepository.findById(id);
        
        if (user.isPresent()) {

            User foundUser = user.get();
            foundUser.setSenha(null); 
            return ResponseEntity.ok(foundUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUserDetails(@PathVariable Integer id, @RequestBody User userDetails) {
        Optional<User> existingUserOpt = userRepository.findById(id);

        if (existingUserOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User existingUser = existingUserOpt.get();

        existingUser.setNome(userDetails.getNome());
        existingUser.setSobrenome(userDetails.getSobrenome());
        existingUser.setEndereco(userDetails.getEndereco());
        existingUser.setTelefone(userDetails.getTelefone());
        


        User updatedUser = userRepository.save(existingUser);
        updatedUser.setSenha(null); 
        
        return ResponseEntity.ok(updatedUser);
    }
    

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}