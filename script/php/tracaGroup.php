<?php
require 'Connexion.php';
$con = new Connexion();
switch ($_GET['typeOfEdit']) {
    case 'new':
        $sql = "INSERT INTO t_nom_traca_group (`ARTICLE`, `DESCRIPTION`, `LIST ID TRACA`,`ORDRE`) VALUES (:article,:title,:listOfItem,:orderNumber)";
		$query = $con->createQuery($sql, ['article'=> $_GET['article'], 'title'=> $_GET['name'], 'listOfItem'=> $_GET['listOfItem'],'orderNumber' => $_GET['orderNumber'] ]);
        break;
    case 'editOrder':
        $sql = "UPDATE t_nom_traca_group SET `ORDRE` = :newOrderNumber WHERE `ARTICLE` = :article AND  `ORDRE` = :oldOrderNumber";
        $query = $con->createQuery($sql, ['newOrderNumber'=> $_GET['newOrderNumber'],'article'=> $_GET['article'], 'oldOrderNumber'=> $_GET['oldOrderNumber']]);
        break;
    case 'editName':
        $sql = "UPDATE t_nom_traca_group SET `DESCRIPTION` = :newName WHERE `ARTICLE` = :article AND  `ORDRE` = :orderNumber";
        $query = $con->createQuery($sql, ['newName'=> $_GET['newName'],'article'=> $_GET['article'], 'orderNumber'=> $_GET['orderNumber']]);
        break;
    case 'editListOfItem':
        $sql = "UPDATE t_nom_traca_group SET `LIST ID TRACA` = :newListOfItem WHERE `ARTICLE` = :article AND  `ORDRE` = :orderNumber";
        $query = $con->createQuery($sql, ['newListOfItem'=> $_GET['newListOfItem'],'article'=> $_GET['article'], 'orderNumber'=> $_GET['orderNumber']]);
        break;

    default:
        # code...
        break;
}
?>