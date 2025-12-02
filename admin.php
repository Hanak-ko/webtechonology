<?php
require_once 'config.php';
if (!isset($_SESSION['admin'])) { header('Location: login.php'); exit; }
?>
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <title>Адмінка • Котяче опитування</title>
  <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600&family=Patrick+Hand&display=swap" rel="stylesheet">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: 'Comfortaa', cursive;
      background: linear-gradient(135deg, #ffeef8 0%, #e6f7ff 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 30px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(255,105,180,0.25);
      border: 6px solid #ff69b4;
    }
    header {
      background: linear-gradient(45deg, #ff69b4, #1e90ff);
      color: white;
      padding: 25px;
      text-align: center;
      position: relative;
    }
    header h1 {
      font-family: 'Patrick Hand', cursive;
      font-size: 42px;
      text-shadow: 3px 3px 10px rgba(0,0,0,0.3);
    }
    .cat { font-size: 50px; position: absolute; top: 15px; }
    .cat.left { left: 20px; }
    .cat.right { right: 20px; transform: scaleX(-1); }
    
    .info-bar {
      background: #fff0f8;
      padding: 20px;
      text-align: center;
      font-size: 20px;
      border-bottom: 4px dashed #ff69b4;
    }
    .export-btn {
      display: inline-block;
      margin: 25px;
      padding: 16px 40px;
      background: linear-gradient(45deg, #4CAF50, #45a049);
      color: white;
      text-decoration: none;
      border-radius: 50px;
      font-size: 18px;
      box-shadow: 0 10px 25px rgba(76,175,80,0.4);
      transition: all 0.3s;
    }
    .export-btn:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(76,175,80,0.6); }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th {
      background: linear-gradient(45deg, #ff69b4, #ff8dc7);
      color: white;
      padding: 18px;
      font-size: 17px;
      text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
    }
    td {
      padding: 16px;
      text-align: center;
      border-bottom: 2px dashed #ffd4e8;
    }
    tr:nth-child(even) { background: #fff5fb; }
    tr:hover { background: #ffe0f0; transform: scale(1.01); transition: 0.2s; }
    
    .delete { color: #ff4444; font-weight: bold; text-decoration: none; }
    .delete:hover { text-decoration: underline; }
    
    .empty { padding: 60px; text-align: center; color: #999; font-size: 24px; }
    .logout { color: #ff69b4; text-decoration: none; font-weight: bold; font-size: 18px; }
  </style>
</head>
<body>

<div class="container">
  <header>
    <h1>Адмінка Котячого Опитування</h1>
  </header>

  <div class="info-bar">
    Всього відповідей: <b style="font-size:28px;color:#ff69b4;">
      <?= $pdo->query("SELECT COUNT(*) FROM responses")->fetchColumn() ?>
    </b>
    <div style="margin-top:10px;">
      <a href="survey.html">Повернутися до анкети</a> • 
      <a href="logout.php" class="logout">Вийти</a>
    </div>
  </div>

  <div style="text-align:center;">
    <a href="export.php" class="export-btn">
      Експорт у текстовий файл
    </a>
  </div>

  <table>
    <tr>
      <th>№</th>
      <th>Ім'я</th>
      <th>Email</th>
      <th>Гра «Коти vs Миші»</th>
      <th>Парад котиків</th>
      <th>Побажання</th>
      <th>Дата</th>
      <th>Дія</th>
    </tr>
    <?php
    $stmt = $pdo->query("SELECT * FROM responses ORDER BY created_at DESC");
    $n = 1;
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "<tr>
          <td><b>{$n}</b></td>
          <td>" . htmlspecialchars($row['name']) . "</td>
          <td>" . htmlspecialchars($row['email']) . "</td>
          <td><b>" . htmlspecialchars($row['q1']) . "</b></td>
          <td>" . htmlspecialchars($row['q2']) . "</td>
          <td style='text-align:left; max-width:300px;'>" . nl2br(htmlspecialchars($row['q3'] ?: '—')) . "</td>
          <td>" . date('d.m.Y H:i', strtotime($row['created_at'])) . "</td>
          <td><a href='delete.php?id={$row['id']}' class='delete' onclick='return confirm(\"Точно видалити?\")'>Видалити</a></td>
        </tr>";
        $n++;
    }
    if ($n === 1) {
        echo "<tr><td colspan='8' class='empty'>Поки що немає відповідей...<br>Чекаємо перших котолюбів!</td></tr>";
    }
    ?>
  </table>
</div>

</body>
</html>