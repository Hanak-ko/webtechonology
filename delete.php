<?php
require_once 'config.php';
if (!isset($_SESSION['admin'])) exit;
$id = $_GET['id'] ?? 0;
$pdo->prepare("DELETE FROM responses WHERE id = ?")->execute([$id]);
header('Location: admin.php');
?>