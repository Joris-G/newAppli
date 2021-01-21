<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT * FROM t_controltool_type";
$query = $con->createQuery($sql,);
$result = $query->fetchAll();
echo json_encode($result);
