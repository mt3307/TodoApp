package com.example.todoapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.todoapp.entity.Todo;
import com.example.todoapp.entity.User;

//JPAでDB操作
@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUserOrderByTaskDateAsc(User user);
}