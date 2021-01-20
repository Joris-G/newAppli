<?php
require 'Connexion.php';
$con = new Connexion();
$listWorkorder = json_decode($_GET['listWorkorder']);
//On créé une ligne de traca sanction Non-conforme par défaut
foreach ($listWorkorder as $key => $value) {
    $sql = "INSERT INTO `t_traca_assy` (`ARTICLE PERE`, `OF PERE`, `ARTICLE FILS`, `OF FILS`, `GESTIONNAIRE`, `NOM`) VALUES (:articlePere, :ofpere, :articleFils,:ofFils, :matGestionnaire, :elevatorName)";
    $query = $con->createQuery($sql, ['articlePere' => $_GET['articlePere'], 'ofpere' => $_GET['ofpere'], 'articleFils' => $value[0], 'ofFils' => $value[1], 'matGestionnaire' => $_GET['matGestionnaire'], 'elevatorName' => $_GET['elevatorName']]);
}
