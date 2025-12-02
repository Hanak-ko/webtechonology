<?php
// export.php — експорт у звичайний текстовий файл .txt
require_once 'config.php';

if (!isset($_SESSION['admin'])) {
    header('Location: login.php');
    exit;
}

// Назва файлу з сьогоднішньою датою
$filename = "відповіді_" . date('Y-m-d') . ".txt";

header('Content-Type: text/plain; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');

// Заголовок файлу
echo "=== ВСІ ВІДПОВІДІ НА ОПИТУВАННЯ ===\r\n";
echo "Дата створення звіту: " . date('d.m.Y H:i:s') . "\r\n\r\n";

$stmt = $pdo->query("SELECT * FROM responses ORDER BY created_at DESC");
$number = 1;

while ($row = $stmt->fetch()) {
    echo "№{$number}\r\n";
    echo "Ім'я: " . $row['name'] . "\r\n";
    echo "Email: " . $row['email'] . "\r\n";
    echo "Гра \"Коти vs Миші\": " . $row['q1'] . "\r\n";
    echo "Парад котиків: " . $row['q2'] . "\r\n";
    echo "Побажання: " . ($row['q3'] ?: '—') . "\r\n";
    echo "Дата: " . $row['created_at'] . "\r\n";
    echo str_repeat("—", 40) . "\r\n\r\n";
    $number++;
}

if ($number === 1) {
    echo "Поки що немає жодної відповіді :(\r\n";
}
?>