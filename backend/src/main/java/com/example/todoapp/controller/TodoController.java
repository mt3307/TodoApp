package com.example.todoapp.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.todoapp.entity.Todo;
import com.example.todoapp.service.TodoService;

import lombok.RequiredArgsConstructor;

//API受付
@RestController
@RequestMapping("/todos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // Reactからアクセスを許可する
public class TodoController {
    private final TodoService todoService;

    @GetMapping("/{userId}")
    // URLの値を取得
    public List<Todo> getTodos(@PathVariable Long userId) {
        return todoService.getTodos(userId);
    }

    // 登録
    @PostMapping("/{userId}")
    public Todo addTodo(@PathVariable Long userId, @RequestBody Todo todo) {
        return todoService.addTodo(userId, todo);
    }

    // 更新
    @PutMapping("/{id}")
    public Todo updateTodo(@PathVariable Long id, @RequestBody Todo todo) {
        return todoService.updateTodo(id, todo);
    }

    // 削除
    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
    }
}