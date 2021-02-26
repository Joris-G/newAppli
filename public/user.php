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
    <title>Utilisateur</title>
    <link rel="stylesheet" href="./styles/user.css">
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
                <div class="topLeftSidebar">
                    <div class="title-accent titleTop">ASSEMBLAGE</div>
                <div class="divCommand"></div>
            </div>
                
                <section class="partDescription"></section>
                
                <section class="divGroupStatus"></section>
            </section>
            <section class="section-operations">
                <div class="opTopBar">
                    <div class="leftOptButtonPan"></div>
                    <div class="op-title-topBar title-accent">OPERATION</div>
                    <div class="rightOptButtonPan"></div>
                </div>
            
            </section>
        </section>
    </section>

</body>
<script type="module" src="../script/menu.js"></script>
<script type="module" src="../script/frontend/user.js"></script>

</html>