<?php
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
    <title>Préparation assemblage</title>
    <link rel="stylesheet" href="./styles/prep-assemblage-composite.css">
</head>

<body>
    <script src="../script/ckeditor/ckeditor.js"></script>
    <script src="../script/qrcode.js"></script>
    <script type="module" src="../script/frontend/prep-assemblage-composite.js"></script>
    <div class='hidden'>
        <div class='user' id='userName'><?php echo $_SESSION['username'] ?></div>
        <div class='user' id="role"><?php echo $_SESSION['role'] ?></div>
        <div class='user' id="matricule"><?php echo $_SESSION['matricule'] ?></div>
    </div>

</body>
<script type="module" src="../script/menu.js"></script>

</html>