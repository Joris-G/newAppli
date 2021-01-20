<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "UPDATE t_nom_traca SET `ID_FAC` = :newIdFac WHERE `ARTICLE` = :article AND  `ID` = :id";
$query = $con->createQuery($sql, ['id'=> $_GET['id'],'article'=> $_GET['article'], 'newIdFac'=> $_GET['newIdFac']]);
?>