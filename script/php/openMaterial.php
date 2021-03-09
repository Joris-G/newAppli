<?php
require 'Connexion.php';
$con = new Connexion();
//REORDONNE LES GROUPES
$sql = "INSERT INTO t_materials_register (`ID MATERIAL ENTRY`) VALUES (:idMat)";
$query = $con->createQuery($sql, ['idMat' => $_GET['idMat']]);
