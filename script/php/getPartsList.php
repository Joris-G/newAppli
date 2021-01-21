<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT `Article`,`Designation`,`Quantite` FROM t_nom_test WHERE CATEGORIE = :categorie AND Parent = :parent";
$query = $con->createQuery($sql, ['categorie' => $_GET['categorie'], 'parent' => $_GET['parent']]);
$result = $query->fetchAll();
echo json_encode($result);
