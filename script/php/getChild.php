<?php
require 'Connexion.php';
header('content-Type: application/json');
$con = new Connexion();
$sql = "SELECT * FROM t_nom_test WHERE Parent = :article";
$query = $con->createQuery($sql, ['article' => $_GET['article']]);
$child = $query->fetchAll();
echo json_encode($child);
