package com.example.todoapp.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

import lombok.Data;

//テーブル定義（todos）
@Entity
@Table(name = "todos")
@Data
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 50)
    private String task;
    private LocalDate taskDate;
    private Boolean completed = false;

    @ManyToOne // 1ユーザ対多タスク
    @JoinColumn(name = "user_id") // 外部キー
    private User user;
}