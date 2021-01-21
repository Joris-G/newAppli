<?php
require 'Connexion.php';
$con = new Connexion();
//TROUVER LE NUMERO ID MATIERE
$sql = "SELECT `ID` FROM t_materials WHERE `ARTICLE` = :article";
$query = $con->createQuery($sql, ['article' => $_GET['articleSap']]);
$idMatiere = $query->fetchColumn();
$nbStickers = $_GET['nbStickers'];
$result;
for ($i = 1; $i <= $nbStickers; $i++) {
    // INSERER LA DONNEE
    $sql = "INSERT INTO t_materials_entry (`ID MATIERE`, `N LOT`,`DATE DE PEREMPTION`) VALUES (:idMatiere,:batchNumber,:shelflifeDate)";
    $query = $con->createQuery($sql, ['idMatiere' => $idMatiere, 'batchNumber' => $_GET['batchNumber'], 'shelflifeDate' => $_GET['shelflifeDate']]);

    if ($i == 1) {
        //PREMIER ID = 
        $sql = "SELECT `ID` FROM t_materials_entry WHERE `ID MATIERE`= :idMatiere AND `N LOT` = :batchNumber AND `DATE DE PEREMPTION`=:shelflifeDate";
        $query = $con->createQuery($sql, ['idMatiere' => $idMatiere, 'batchNumber' => $_GET['batchNumber'], 'shelflifeDate' => $_GET['shelflifeDate']]);
        $result = $query->fetchColumn();
    }
}
echo $result;
