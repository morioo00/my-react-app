package com.example.backend.dto;

import java.util.List;

public class UserAnswerDto {

    public String email;
    public String answer;

    public UserAnswerDto(String email, String answer) {
        this.email = email;
        this.answer = answer;
    }
}