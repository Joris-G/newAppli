<?php
require 'Connexion.php';
$con = new Connexion();
//REORDONNE LES GROUPES
$sql = "UPDATE t_nom_traca_group SET `ORDRE` = `ORDRE`+1 WHERE `ARTICLE` = :article AND `ORDRE` >= :ordre";

$query = $con->createQuery(
    $sql,
    [
        'article' => $_GET['article'],
        'ordre' => $_GET['ordre']
    ]
);


//AJOUTE LE NOUVEAU GROUPE
$sql = "INSERT INTO t_nom_traca_group (`ARTICLE`,`DESCRIPTION`,`ORDRE`, `ID_GROUP`) 
VALUES (:article,:descript,:ordre,:shortName)";

$query = $con->createQuery(
    $sql,
    [
        'article' => $_GET['article'],
        'descript' => $_GET['descript'],
        'ordre' => $_GET['ordre'],
        'shortName' => $_GET['shortName']
    ]
);
