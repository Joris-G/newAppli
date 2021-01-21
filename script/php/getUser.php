<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT * FROM t_user WHERE MATRICULE = :matricule";
$query = $con->createQuery($sql, ['matricule' => $_GET['matricule']]);
$result = $query->fetch();
echo json_encode($result);
