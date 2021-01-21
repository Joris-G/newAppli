<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT `Designation` FROM t_nom_test WHERE `Article` = :article";
$query = $con->createQuery($sql, ['article' => $_GET['article']]);
$result = $query->fetchColumn();
echo $result;
