<?php
require 'Connexion.php';
$con = new Connexion();
$userPoints;
$sql="SELECT COUNT(`MATRICULE`) FROM t_traca_users WHERE `MATRICULE` = :userMatricule";
$query = $con->createQuery($sql,['userMatricule'=>$_GET['matricule']]);
$userPoints = $query->fetch();

