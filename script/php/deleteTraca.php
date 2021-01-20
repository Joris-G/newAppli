<?php
require 'Connexion.php';
$con = new Connexion();
//DELETE
$sql = "UPDATE t_traca SET `STATUT` = 0, `DATE_DE_MODIFICATION` = NOW() WHERE `ID` = :id";
$query = $con->createQuery($sql, ['id'=> $_GET['id']]);