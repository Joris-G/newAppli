<?php
header('content-Type: application/json');
session_start();
//$username = stripslashes($_POST['username']);
require 'Connexion.php';
$con = new Connexion();

if (count($_GET)<2) {
    $sql = "SELECT * FROM t_user WHERE MATRICULE = :matricule";
    $query = $con->createQuery($sql, ['matricule' => $_GET['matricule']]);
}else{
    $sql = "SELECT * FROM t_user WHERE MATRICULE = :matricule AND mot_de_passe = :mdp";
    $query = $con->createQuery($sql, ['matricule' => $_GET['userName'],'mdp' => $_GET['password'] ]);
}
    $result = $query->fetch();

$username = $result['NOM'] . ' ' . $result['PRENOM'];
$matricule = $result['MATRICULE'];
$role = $result['ROLE'];
$teamNumber = $result['EQUIPE'];

$_SESSION['matricule'] = $matricule;
$_SESSION['role'] = $role;
$_SESSION['username'] = $username;
$_SESSION['teamNumber'] = $teamNumber;

$sql = "UPDATE t_user SET `DERNIERE CONNEXION` = now() WHERE `ID` = :idUser";
$query = $con->createQuery($sql,['idUser'=>$result['ID']]);
echo json_encode($result);
//var_dump($_SESSION);
//header("Location: ../../public/index.html");
