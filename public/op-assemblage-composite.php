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
    <title>Traçabilité assemblage</title>
    <link rel="stylesheet" href="./styles/op-assemblage-composite-bis.css">
</head>

<body>


    <script src="../script/qrcode.js"></script>
    <div class='hidden'>
        <div class='user' id='userName'><?php echo $_SESSION['username'] ?></div>
        <div class='user' id="role"><?php echo $_SESSION['role'] ?></div>
        <div class='user' id="matricule"><?php echo $_SESSION['matricule'] ?></div>
        <div class='user' id="teamNumber"><?php echo $_SESSION['teamNumber'] ?></div>
    </div>
    <section class="module">
        <section class="content">
            <section class="leftSideBar">
                <div class="leftSideBarTitle">ASSEMBLAGE</div>
                <section class="partDescription"></section>
                <div class="divCommand"></div>
                <section class="divGroupStatus"></section>
            </section>
            <section class="section-operations">
            <div class="OperationTitle">OPERATION</div>
            </section>
            <section class="rightSideBar"></section>
        </section>
    </section>

</body>
<script type="module" src="../script/menu.js"></script>
<script type="module" src="../script/frontend/op-assemblage-composite-bis.js"></script>

</html>