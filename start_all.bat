@echo off
rem MariaDB起動
start cmd /k "mysql -u root -p"

rem SpringBoot起動
start cmd /k "cd backend && mvnw spring-boot:run"

rem React起動
start cmd /k "cd frontend && npm start"