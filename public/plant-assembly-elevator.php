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
    <title>Plant ELEVATOR</title>
    <link rel="stylesheet" href="./styles/plant-assembly-elevator.css">
</head>

<body>
    <div class='hidden'>
        <div class='user' id='userName'><?php echo $_SESSION['username'] ?></div>
        <div class='user' id="role"><?php echo $_SESSION['role'] ?></div>
        <div class='user' id="matricule"><?php echo $_SESSION['matricule'] ?></div>
        <div class='user' id="teamNumber"><?php echo $_SESSION['teamNumber'] ?></div>
    </div>
    <div class="content">
        <div class="assembly-line" id="line-left">
            <div class="title">Elevator LH</div>
            <div id="launched-assembly">
                <div class="title">Assemblages lancés</div>
            </div>
            <div id="st0-assembly">
                <div class="title">ST0</div>
            </div>
            <div id="st1-assembly">
                <div class="title">ST1</div>
            </div>
            <div id="st2-assembly">
                <div class="title">ST2</div>
            </div>
        </div>
        <div class="assembly-line" id="line-right">
            <div class="title">Elevator RH</div>
            <div id="launched-assembly">
                <div class="title">Assemblages lancés</div>
            </div>
            <div id="st0-assembly">
                <div class="title">ST0</div>
            </div>
            <div id="st1-assembly">
                <div class="title">ST1</div>
            </div>
            <div id="st2-assembly">
                <div class="title">ST2</div>
            </div>
        </div>
    </div>
</body>
<script type="module" src="../script/menu.js"></script>
<script type="module" src="../script/frontend/plant-assembly-elevator.js"></script>

</html>