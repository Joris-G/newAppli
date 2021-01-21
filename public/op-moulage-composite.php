<?php
session_start();
var_dump($_SESSION);
if (empty($_SESSION['username'])) {
    header("Location: login.php");
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Traçabilité moulage</title>
    <link rel="stylesheet" href="./styles/moulage.css">
</head>

<body>

    <script type="module" src="../script/frontend/op-moulage.js"></script>
    <div class='hidden'>
        <div class='user' id='userName'><?php echo $_SESSION['username'] ?></div>
        <div class='user' id="role"><?php echo $_SESSION['role'] ?></div>
        <div class='user' id="matricule"><?php echo $_SESSION['matricule'] ?></div>
    </div>

</body>

</html>