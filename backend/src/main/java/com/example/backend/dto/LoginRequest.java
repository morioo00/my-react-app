
package com.example.backend.dto;

public class LoginRequest {
    private String username;
    private String password;

    public String getEmail() {
        return username;
    }

    public String getPassword() {
        return password;
    }
}