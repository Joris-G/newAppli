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
        <link rel="stylesheet" href="./styles/module-utilisateur.css">
    </head>

    <body>
       
        <div class='hidden'>
            <div class='user' id='userName'><?php echo $_SESSION['username'] ?></div>
            <div class='user' id="role"><?php echo $_SESSION['role'] ?></div>
            <div class='user' id="matricule"><?php echo $_SESSION['matricule'] ?></div>
            <div class='user' id="teamNumber"><?php echo $_SESSION['teamNumber'] ?></div>
        </div>
        <div class="content">
            <div class="toolBar">
            <button id="btn-team-user">Liste utilisateur équipe</button>
            </div>

            <div class="title">MODULE UTILISATEURS</div>
            <div class="currentUser">
                <div class="identity"><?php echo $_SESSION['username'] ?></div>
                <div class="matricule"><?php echo $_SESSION['matricule'] ?></div>
                <div class="role"><?php echo $_SESSION['role'] ?></div>

                <div class="tracaCount">Afficher le nombre de traça réalisées</div>
                <div class="favPart">Affiche la pièce favorite</div>
                <div class="graphMonth">Trace un graphique de l'évolution du nombre de traça par jour légende par pièce différente</div>
            </div>
        </div>
    </body>
        <script src="../script/qrcode.js"></script>
        <script type="module" src="../script/menu.js"></script>
        <script type="module" src="../script/frontend/module-utilisateur.js"></script>

</html>