package com.example.backend.dto;

public class AttendeeDto {

    private String email;
    private String name;
    private String avatarUrl;
    private String status;
    private String answer;

    // ✅ 全フィールドを受け取るコンストラクタ
    public AttendeeDto(String email, String name, String avatarUrl, String status, String answer) {
        this.email = email;
        this.name = name;
        this.avatarUrl = avatarUrl;
        this.status = status;
        this.answer = answer;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public String getStatus() {
        return status;
    }

    public String getAnswer() {
        return answer;
    }
}