<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT * FROM t_materials_register WHERE `CLOSE DATE` IS NULL";
$query = $con->createQuery($sql,);
$result = $query->fetchAll();
echo json_encode($result);
