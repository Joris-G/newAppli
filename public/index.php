<?php
require '../script/php/Connexion.php';
$DB = new Connexion();
session_start();
if (empty($_SESSION['username'])) {
  header("Location: login.php");
}

?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application traçabilité</title>
  <link rel="stylesheet" href="./styles/index.css">
</head>

<body>
  <div class='hidden'>
    <div class='user' id='userName'><?php echo $_SESSION['username'] ?></div>
    <div class='user' id="role"><?php echo $_SESSION['role'] ?></div>
    <div class='user' id="matricule"><?php echo $_SESSION['matricule'] ?></div>
    <div class='user' id="teamNumber"><?php echo $_SESSION['teamNumber'] ?></div>
  </div>
  <script type="module" src="../script/frontend/index.js"></script>

</body>
<script type="module" src="../script/menu.js"></script>

</html>