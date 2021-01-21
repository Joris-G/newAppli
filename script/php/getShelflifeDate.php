<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT * FROM t_materials_entry WHERE ID = :idMat";
$query = $con->createQuery($sql, ['idMat' => $_GET['idMat']]);
$result = $query->fetch();
echo json_encode($result);
