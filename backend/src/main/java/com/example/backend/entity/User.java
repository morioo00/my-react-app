package com.example.backend.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "supabase_user_id"),
        @UniqueConstraint(columnNames = "email")
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "supabase_user_id", nullable = false, unique = true) // ここ変更
    private String supabaseUserId;

    @Column(nullable = false, unique = true) // ここ変更
    private String email;

    @OneToMany(mappedBy = "author")
    private List<Event> events;

    public User() {
    } // JPA用

    public User(String supabaseUserId, String email) { // ここ変更
        this.supabaseUserId = supabaseUserId;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public String getSupabaseUserId() { // ここ追加
        return supabaseUserId;
    }

    public String getEmail() { // ここ追加
        return email;
    }

    public void setSupabaseUserId(String supabaseUserId) { // ここ追加
        this.supabaseUserId = supabaseUserId;
    }

    public void setEmail(String email) { // ここ追加
        this.email = email;
    }
}