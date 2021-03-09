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
    <title>Impression marquage OF</title>
    <link rel="stylesheet" href="./styles/gest-edit-of.css">
</head>

<body>
    <div class='hidden'>
        <div class='user' id='userName'><?php echo $_SESSION['username'] ?></div>
        <div class='user' id="role"><?php echo $_SESSION['role'] ?></div>
        <div class='user' id="matricule"><?php echo $_SESSION['matricule'] ?></div>
        <div class='user' id="teamNumber"><?php echo $_SESSION['teamNumber'] ?></div>
    </div>
    <div class="content-gest-edit-of" style="margin:2%;">
        <div class="input-file" style="margin-right:10px;grid-area:a">
            <label for="csv-article-of">Importer fichier CSV</label>
            <input type="file" accept=".csv" name="csv-article-of" id="csv-article-of" class="input-csv-file">
        </div>
        <div class="template" style="grid-area:b;">
            <h2>Selectionner un template</h2>
            <label for=""></label>
            <select name="" id="">
                <option value="1">Elevator (3 colonnes de 8 étiquettes 63.5x33.9)</option>
            </select>
            <button id="btn-print">Imprimer</button>
        </div>
        <div class="sheet-param" style="display:flex;flex-direction:row;grid-area:c">
            <div class="new-template">
                <h2 style="grid-area:tp-top">Créer un nouveau template</h2>
                <div class="template-name" style="grid-area:tp-name">
                    <label for="">Nom du template</label>
                    <input type="text" name="" id="">
                </div>

                <div class="dimensions" style="display:flex;flex-direction:column;margin-right:10px;grid-area:tp-format;">
                    <label for="format">Format page</label>
                    <select name="format" id="format-print-page">
                        <option value="A4">A4</option>
                        <option value="A3">A3</option>
                    </select>
                    <label for="">Nombre étiquettes</label>
                    <input type="number" name="" id="">
                    <label for="">Marge supérieur (cm)</label>
                    <input type="number" name="" id="">
                    <label for="">Marge inférieur (cm)</label>
                    <input type="number" name="" id="">
                    <label for="">Marge gauche (cm)</label>
                    <input type="number" name="" id="">
                    <label for="">Marge droite (cm)</label>
                    <input type="number" name="" id="">
                    <label for="">Longueur de l'étiquette</label>
                    <input type="number" name="" id="">
                    <label for="">Hauteur de l'étiquette</label>
                    <input type="number" name="" id="">
                </div>
                <div class="layout" style="display:flex;flex-direction:column;margin-right:10px;grid-area:tp-layout;">
                    <label for="">Espace horizontal entre étiquettes (cm)</label>
                    <input type="number" name="" id="">
                    <label for="">Espace vertical entre étiquettes (cm)</label>
                    <input type="number" name="" id="">
                    <label for="">Nombre de colonne</label>
                    <input type="number" name="" id="">
                    <label for="">Nombre de ligne</label>
                    <input type="number" name="" id="">
                    <label for="layout-direction">Disposition des éléments</label>
                    <select name="layout-direction" id="layout-direction">
                        <option value="column">En colonne</option>
                        <option value="row">En ligne</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</body>
<script src="../script/qrcode.js"></script>
<script type="module" src="../script/menu.js"></script>
<script type="module" src="../script/frontend/gest-edit-of.js"></script>

</html>