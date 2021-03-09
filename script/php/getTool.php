<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT * FROM t_tools WHERE numOtSap = :numOtSap";
$query = $con->createQuery($sql, ['numOtSap'=> $_GET['numOtSap']]);
$result = $query->fetch();
echo json_encode($result);
?>