<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT COMPLEMENT FROM t_traca_of WHERE `ID TRACA` = (
    SELECT ID FROM t_traca WHERE OF = :of AND `ID FAC` = (
        SELECT `ID TRACA` FROM t_nom_traca_of WHERE ARTICLE = :article))";
$query = $con->createQuery($sql, ['of' => $_GET['of'], 'article' => $_GET['article']]);
$result = $query->fetchColumn();
echo $result;
