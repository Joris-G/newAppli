<?php
require 'Connexion.php';
$con = new Connexion();
//Article info
$sql = "SELECT * FROM t_ref WHERE `numArticleSap` = :article";
$query = $con->createQuery($sql, ['article' => $_GET['article']]);
$articleInfos = $query->fetch();

//BoxName
$sql ="SELECT `NOM` FROM t_traca_assy WHERE `OF FILS` = :workOrder";
$query = $con->createQuery($sql,['workOrder'=>$_GET['OF']]);
$boxName = $query->fetchColumn();
$result = [$articleInfos,$boxName];
echo JSON_encode($result);
