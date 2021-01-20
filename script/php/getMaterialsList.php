<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT `ID`,`DESIGNATION SIMPLIFIEE`, ARTICLE,`DUREE DE VIE` FROM t_materials WHERE SECTEUR = :secteur";
$query = $con->createQuery($sql, ['secteur' => $_GET['secteur']]);
$result = $query->fetchAll();
echo json_encode($result);
