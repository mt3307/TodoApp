package com.example.todoapp.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.todoapp.entity.Todo;
import com.example.todoapp.entity.User;
import com.example.todoapp.repository.TodoRepository;
import com.example.todoapp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TodoService {
    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    public List<Todo> getTodos(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();

        return todoRepository.findByUserOrderByTaskDateAsc(user);
    }

    public Todo addTodo(Long userId, Todo todo) {
        User user = userRepository.findById(userId).orElseThrow();
        todo.setUser(user);

        return todoRepository.save(todo);
    }

    public Todo updateTodo(Long id, Todo newTodo) {
        Todo todo = todoRepository.findById(id).orElseThrow();
        todo.setTask(newTodo.getTask());
        todo.setTaskDate(newTodo.getTaskDate());

        return todoRepository.save(todo);
    }

    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }
}