package com.example.backend.controller;

import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest req) {
        if (req.username() == null || req.username().isBlank()
                || req.password() == null || req.password().isBlank()) {
            return ResponseEntity.badRequest().body("username/password required");
        }

        if (userRepository.existsByUsername(req.username())) {
            return ResponseEntity.status(409).body("username already exists");
        }

        String hash = encoder.encode(req.password());
        userRepository.save(new User(req.username(), hash));

        return ResponseEntity.ok("registered: " + req.username());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body("username/password required");
        }

        Optional<User> opt = userRepository.findByUsername(request.getUsername());
        if (opt.isEmpty()) {
            return ResponseEntity.status(401).body("invalid username or password");
        }

        User user = opt.get();
        if (!encoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body("invalid username or password");
        }

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "username", user.getUsername()));
    }
}