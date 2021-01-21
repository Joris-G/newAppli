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
    <title>Registre des matières</title>
    <link rel="stylesheet" href="./styles/ECME.css">
</head>

<body>
    <script src="../script/qrcode.js"></script>
    <div class='hidden'>
        <div class='user' id='userName'><?php echo $_SESSION['username'] ?></div>
        <div class='user' id="role"><?php echo $_SESSION['role'] ?></div>
        <div class='user' id="matricule"><?php echo $_SESSION['matricule'] ?></div>
    </div>
    <div class="content"></div>
</body>
<script src="../script/qrcode.js"></script>
<script type="module" src="../script/menu.js"></script>
<script type="module" src="../script/frontend/ecme.js"></script>

</html>