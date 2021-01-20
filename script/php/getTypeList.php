<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT SECTEUR FROM t_secteur";
$query = $con->createQuery($sql);
$result = $query->fetchAll();
echo json_encode($result);
?>