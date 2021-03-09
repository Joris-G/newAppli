<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT * FROM t_user WHERE EQUIPE = :teamNumber";
$query = $con->createQuery($sql, ['teamNumber'=>$_GET['teamNumber']] );
$result = $query->fetchAll();
echo json_encode($result);