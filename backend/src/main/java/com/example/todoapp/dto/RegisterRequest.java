package com.example.todoapp.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String userId;
    private String password;
}