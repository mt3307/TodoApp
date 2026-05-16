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
        User user = new User();
        user.setUserId(request.getUserId());
        user.setPassword(request.getPassword());

        return userRepository.save(user);
    }
}
