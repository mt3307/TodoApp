package com.example.todoapp.service;

import org.springframework.stereotype.Service;

import com.example.todoapp.dto.ChangePasswordRequest;
import com.example.todoapp.dto.LoginRequest;
import com.example.todoapp.dto.RegisterRequest;
import com.example.todoapp.entity.User;
import com.example.todoapp.repository.UserRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    // ログイン処理
    public User login(LoginRequest request) {

        // ユーザ検索
        return userRepository.findByUserId(request.getUserId())
                // パスワード一致を確認
                .filter(user -> passwordEncoder.matches(request.getPassword(), user.getPassword()))
                .orElse(null);
    }

    // 新規ユーザ登録
    public User register(RegisterRequest request) {
        if (userRepository.existsByUserId(request.getUserId())) {
            throw new RuntimeException("同じユーザIDは使用できません");
        }

        if (request.getPassword().length() < 8) {
            throw new RuntimeException("パスワードは8文字以上で入力してください");
        }

        User user = new User();
        user.setUserId(request.getUserId());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // パスワードを暗号化

        return userRepository.save(user);
    }

    // パスワード変更機能
    public void changePassword(ChangePasswordRequest request) {
        User user = userRepository.findById(request.getUserId()).orElseThrow();

        // 現在のパスワードを確認
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("現在のパスワードが違います");
        }

        // 新しいパスワードのバリデーション
        if (request.getNewPassword().length() < 8) {
            throw new RuntimeException("パスワードは8文字以上で入力してください");
        }

        // ハッシュ化して保存
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
