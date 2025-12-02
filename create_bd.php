<?php
try {
    $pdo = new PDO("mysql:host=localhost", "root", "");
    $pdo->exec("CREATE DATABASE IF NOT EXISTS survey_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE survey_db");
    echo "База survey_db успішно створена! Тепер анкета працюватиме!";
} catch (Exception $e) {
    echo "Помилка: " . $e->getMessage();
}
?>