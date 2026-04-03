package com.example.backend.dto;

public class AttendeeDto {

    private String email;
    private String status;
    private String answer;

    public AttendeeDto(String email, String status, String answer) {
        this.email = email;
        this.status = status;
        this.answer = answer;
    }

    public String getEmail() {
        return email;
    }

    public String getStatus() {
        return status;
    }

    public String getAnswer() {
        return answer;
    }
}