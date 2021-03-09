<?php
require 'Connexion.php';
$con = new Connexion();
$baseName = basename($_FILES['inputFile']["name"]);
$splitBaseName =explode('.',$baseName);
$newName = $splitBaseName[0] . microtime(true) . '.' . $splitBaseName[1];
var_dump($newName);
$targetPath = "../../public/src/img/FAC/" . $newName;
move_uploaded_file($_FILES['inputFile']["tmp_name"], $targetPath);

$sql = "UPDATE t_nom_traca SET `IMAGE`= :imgName WHERE `ID`= :id";
$query = $con->createQuery($sql,['imgName'=> $newName, 'id'=> $_POST["idOp"]]);