<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT * FROM t_controltool_type WHERE SECTEUR = :secteur";
$query = $con->createQuery($sql, ['secteur'=> $_GET['secteur']]);
$result = $query->fetchAll();
echo json_encode($result);
