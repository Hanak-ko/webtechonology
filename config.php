<?php
session_start();
try {
    $pdo = new PDO("mysql:host=localhost;dbname=survey_db;charset=utf8mb4", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Автоматичне створення бази і таблиці, якщо їх немає
    $pdo->exec("CREATE DATABASE IF NOT EXISTS survey_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE survey_db");
    $pdo->exec("CREATE TABLE IF NOT EXISTS responses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        q1 VARCHAR(255) NOT NULL,
        q2 VARCHAR(255) NOT NULL,
        q3 TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
} catch (Exception $e) {
    die("Помилка бази: " . $e->getMessage());
}
?>