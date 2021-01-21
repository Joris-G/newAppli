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
                <img src="src/img/qr-code.png" alt="SCAN QR CODE" id='img-scan'>
            </div>
            <form action="" method="get">
                <div class="login-mdp">
                    <div class="input-group">
                        <label for="login">Nom d'utilisateur</label>
                        <input type="text" name="login" id="login">
                    </div>

                    <div class="input-group">
                        <label for="mdp">Mot de passe</label>
                        <input type="password" name="mdp" id="mdp">
                    </div>
                    
                    <div class="btn btn-M btn-primary btn-radius" id='btn-login'>CONNEXION</div>
                </form>
            </div>
        </div>
    </div>
    <script type="module" src="../script/login.js"></script>

</body>

</html>