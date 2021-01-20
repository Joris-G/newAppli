<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT * FROM t_ref WHERE `numArticleSap` = :article";
$query = $con->createQuery($sql, ['article' => $_GET['article']]);
$result = $query->fetch();
echo JSON_encode($result);
