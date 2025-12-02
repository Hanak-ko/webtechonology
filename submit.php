<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') exit(json_encode(['success'=>false]));

$name  = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$q1    = $_POST['q1'] ?? '';
$q2    = $_POST['q2'] ?? '';
$q3    = trim($_POST['q3'] ?? '');

if (empty($name) || empty($email) || empty($q1) || empty($q2)) {
    exit(json_encode(['success'=>false, 'error'=>'Заповніть всі поля']));
}

try {
    $stmt = $pdo->prepare("INSERT INTO responses (name, email, q1, q2, q3) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$name, $email, $q1, $q2, $q3]);

    // Зберігаємо ще й у файл
    $folder = 'survey/';
    if (!is_dir($folder)) mkdir($folder, 0777, true);
    $text = "Ім'я: $name\nEmail: $email\nГра: $q1\nПарад: $q2\nПобажання: $q3\nЧас: " . date('d.m.Y H:i:s') . "\n\n";
    file_put_contents($folder . 'response_' . date('Y-m-d_H-i-s') . '.txt', $text);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Помилка']);
}
?>