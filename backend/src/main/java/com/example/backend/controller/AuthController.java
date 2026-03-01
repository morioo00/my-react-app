package com.example.backend.controller;

import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

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

        if (req.username() == null || req.password() == null
                || req.username().isBlank() || req.password().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("ユーザー名とパスワードを入力してください");
        }

        if (!req.username().matches("^[A-Za-z0-9]{1,30}$")) {
            return ResponseEntity.badRequest()
                    .body("半角英数で入力してください");
        }

        if (userRepository.existsByUsername(req.username())) {
            return ResponseEntity.status(409)
                    .body("このユーザー名は既に使われています");
        }

        String hash = encoder.encode(req.password());
        userRepository.save(new User(req.username(), hash));

        return ResponseEntity.ok("登録しました");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {

        if (request.getUsername() == null || request.getPassword() == null
                || request.getUsername().isBlank() || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("ユーザー名とパスワードを入力してください");
        }

        if (!request.getUsername().matches("^[A-Za-z0-9]{1,30}$")) {
            return ResponseEntity.badRequest()
                    .body("半角英数で入力してください");
        }

        Optional<User> opt = userRepository.findByUsername(request.getUsername());
        if (opt.isEmpty()) {
            return ResponseEntity.status(401)
                    .body("ユーザー名またはパスワードが違います");
        }

        User user = opt.get();
        if (!encoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(401)
                    .body("ユーザー名またはパスワードが違います");
        }

        return ResponseEntity.ok("ログイン成功");
    }
}