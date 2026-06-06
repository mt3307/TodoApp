package com.example.todoapp.dto;

import lombok.Data;

//ReactからJSON形式でデータを受け取る
@Data
public class ChangePasswordRequest {
    private Long userId;
    private String currentPassword;
    private String newPassword;
}
