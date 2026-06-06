package com.example.todoapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.todoapp.dto.LoginRequest;
import com.example.todoapp.dto.RegisterRequest;
import com.example.todoapp.dto.ChangePasswordRequest;
import com.example.todoapp.entity.User;
import com.example.todoapp.service.AuthService;

import lombok.RequiredArgsConstructor;

//API受付
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    private final AuthService authService;

    // フロントエンドからHTTPリクエストを受付
    @PostMapping("/login")
    // JSON受け取り
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = authService.login(request);

        if (user == null) {
            return ResponseEntity.badRequest().body("ログイン失敗");
        }

        // HTTPレスポンスを返却
        return ResponseEntity.ok(user);
    }

    // 登録用API受付
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        try {
            return ResponseEntity.ok(authService.register(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // パスワード変更のリクエストを受け付ける
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            authService.changePassword(request);
            return ResponseEntity.ok("パスワード変更成功");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}