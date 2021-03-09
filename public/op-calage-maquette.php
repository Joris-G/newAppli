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
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div class='hidden'>
        <div class='user' id='userName'><?php echo $_SESSION['username'] ?></div>
        <div class='user' id="role"><?php echo $_SESSION['role'] ?></div>
        <div class='user' id="matricule"><?php echo $_SESSION['matricule'] ?></div>
        <div class='user' id="teamNumber"><?php echo $_SESSION['teamNumber'] ?></div>
    </div>
    <div class="content">
        <div class="tableCalage">
            <table>
                <thead>
                    <tr>
                        <td>Point</td>
                        <td>Mesure</td>
                        <td colspan=3>Type de calage</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>PT1</td>
                        <td><input type="text"></td>
                        <td>pas de calage<input type="checkbox" name="" id=""></td>
                        <td>calage liquide<input type="checkbox" name="" id=""></td>
                        <td>calage solide<input type="checkbox" name="" id=""></td>
                    </tr>
                    <tr>
                        <td>PT2</td>
                        <td><input type="text"></td>
                        <td>pas de calage<input type="checkbox" name="" id=""></td>
                        <td>calage liquide<input type="checkbox" name="" id=""></td>
                        <td>calage solide<input type="checkbox" name="" id=""></td>
                    </tr>
                    <tr>
                        <td>PT3</td>
                        <td><input type="text"></td>
                        <td>pas de calage<input type="checkbox" name="" id=""></td>
                        <td>calage liquide<input type="checkbox" name="" id=""></td>
                        <td>calage solide<input type="checkbox" name="" id=""></td>
                    </tr>
                    <tr>
                        <td>PT4</td>
                        <td><input type="text"></td>
                        <td>pas de calage<input type="checkbox" name="" id=""></td>
                        <td>calage liquide<input type="checkbox" name="" id=""></td>
                        <td>calage solide<input type="checkbox" name="" id=""></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="echelleCalage">

        </div>
        <div class="commandes">
            
        </div>
    </div>
</body>
<script type="module" src="../script/menu.js"></script>
</html>