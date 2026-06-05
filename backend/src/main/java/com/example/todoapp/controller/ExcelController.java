package com.example.todoapp.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.todoapp.service.ExcelService;

//リクエストを受け付け、Serviceへ
@RestController
@RequiredArgsConstructor
@RequestMapping("/excel")
public class ExcelController {
    private final ExcelService excelService;

    @GetMapping("/{userId}")
    public ResponseEntity<ByteArrayResource> downloadExcel(@PathVariable Long userId) {
        ByteArrayResource resource = excelService.downloadExcel(userId);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=todo.xlsx")
                .body(resource);
    }

}
