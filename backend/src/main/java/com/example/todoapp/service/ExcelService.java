package com.example.todoapp.service;

//import java.io.IOException;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

//FastAPIと連携
@Service
public class ExcelService {
    public ByteArrayResource downloadExcel(Long userId) {
        String url = "http://127.0.0.1:8000/excel/" + userId;

        RestTemplate restTemplate = new RestTemplate();

        byte[] excelFile = restTemplate.getForObject(url, byte[].class);

        return new ByteArrayResource(excelFile);
    }
}
