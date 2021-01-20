<?php
session_start();
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion à l'application traçabilité</title>
    <link rel="stylesheet" href="../public/styles/login.css">
</head>

<body>
    <div class="content middleScreen">
        <div class="title">AUTHENTIFICATION</div>
        <div class="authentifications">
            <div class="login-qrcode">
                <img src="" alt="SCAN QR CODE">
            </div>
            <div class="login-mdp">
                <label for="login">Nom d'utilisateur</label>
                <input type="text" name="login" id="login">
                <label for="mdp">Mot de passe</label>
                <input type="text" name="mdp" id="mdp">
                <div class="btn btn-M">CONNEXION</div>
            </div>
        </div>
    </div>
    <script src="../script/login.js"></script>

</body>

</html>