<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT * FROM t_materials_entry WHERE `ID` =:id";
$query = $con->createQuery($sql, ['id' => $_GET['id']]);
$result = $query->fetch();
echo json_encode($result);
