package com.example.backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        System.out.println("aaa");
        return "Backend !!!";
    }
}