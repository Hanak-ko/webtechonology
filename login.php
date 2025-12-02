<?php
// login.php
session_start();
if ($_POST) {
    $user = $_POST['username'] ?? '';
    $pass = $_POST['password'] ?? '';

    if ($user === 'admin' && $pass === '12345') {  // ЗМІНИ ПАРОЛЬ!
        $_SESSION['admin'] = true;
        header('Location: admin.php');
        exit;
    } else {
        $error = "Невірний логін або пароль";
    }
}
?>

<!DOCTYPE html>
<html><head><title>Вхід адміна</title><style>body{font-family:Arial;margin:100px auto;width:300px;text-align:center;}</style></head>
<body>
  <h2>Вхід в адмінку</h2>
  <?php if(isset($error)) echo "<p style='color:red'>$error</p>"; ?>
  <form method="post">
    <input type="text" name="username" placeholder="Логін" required><br><br>
    <input type="password" name="password" placeholder="Пароль" required><br><br>
    <button type="submit">Увійти</button>
  </form>
</body></html>