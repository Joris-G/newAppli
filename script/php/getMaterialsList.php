<?php

function unique_key($array, $keyname)
{

    $new_array = array();
    foreach ($array as $key => $value) {

        if (!isset($new_array[$value[$keyname]])) {
            $new_array[$value[$keyname]] = $value;
        }
    }
    $new_array = array_values($new_array);
    return $new_array;
}


require 'Connexion.php';
$con = new Connexion();
if (array_key_exists('article', $_GET)) {
    $sql = "SELECT * FROM `t_nom_test` WHERE `Parent` = :article AND `CATEGORIE` = 'MATIERE'";
    $query = $con->createQuery($sql, ['article' => $_GET['article']]);
    $result = $query->fetchAll();
    $result = unique_key($result,'Article');
} else {
    $sql = "SELECT `ID`,`DESIGNATION SIMPLIFIEE`, ARTICLE,`DUREE DE VIE` FROM t_materials WHERE SECTEUR = :secteur";
    $query = $con->createQuery($sql, ['secteur' => $_GET['secteur']]);
    $result = $query->fetchAll();
}

echo json_encode($result);
