<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT * FROM t_ecme";
$query = $con->createQuery($sql);
$result = $query->fetchAll();
echo json_encode($result);
