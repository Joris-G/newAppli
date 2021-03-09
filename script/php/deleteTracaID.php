<?php
require 'Connexion.php';
$con = new Connexion();
//DELETE
$sql = "UPDATE t_nom_traca SET `ID_FAC` = null, `DATE_SUPPRESSION` = NOW() WHERE `ID` = :id";
$query = $con->createQuery($sql, ['id'=> $_GET['id']]);
//RE ORDER
$sql = "SELECT ID,ID_FAC FROM t_nom_traca WHERE `ARTICLE` = :article AND `ID_FAC` != 0 ORDER BY ID_FAC ASC";
$query = $con->createQuery($sql, ['article'=> $_GET['article']]);
$result = $query -> fetchAll();
foreach ($result as $key => $value) {
    $sql = "UPDATE t_nom_traca SET `ID_FAC`= :reorderId WHERE `ID` = :id";
    $query = $con->createQuery($sql, ['id'=> $value['ID'], 'reorderId'=>($key+1)]); 
}
