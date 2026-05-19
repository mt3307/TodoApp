package com.example.todoapp.service;

import org.springframework.stereotype.Service;

import com.example.todoapp.dto.LoginRequest;
import com.example.todoapp.dto.RegisterRequest;
import com.example.todoapp.entity.User;
import com.example.todoapp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public User login(LoginRequest request) {

        return userRepository.findByUserId(request.getUserId())
                .filter(user -> user.getPassword().equals(request.getPassword()))
                .orElse(null);
    }

    public User register(RegisterRequest request) {
        if (userRepository.existsByUserId(request.getUserId())) {
            throw new RuntimeException("同じユーザIDは使用できません");
        }

        if (request.getPassword().length() < 8) {
            throw new RuntimeException("パスワードは8文字以上で入力してください");
        }

        User user = new User();
        user.setUserId(request.getUserId());
        user.setPassword(request.getPassword());

        return userRepository.save(user);
    }
}
