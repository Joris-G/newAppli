<?php
require 'Connexion.php';
header('content-Type: application/json');
$con = new Connexion();
$sql = "SELECT * FROM t_nom_traca WHERE ARTICLE = :article AND ID_FAC != 0 ORDER BY `ID_FAC`";
$query = $con->createQuery($sql, ['article' => $_GET['article']]);
$nomTraca = $query->fetchAll();

$sql = "SELECT * FROM t_nom_traca_group WHERE ARTICLE = :article ORDER BY `ORDRE`";
$query = $con->createQuery($sql, ['article' => $_GET['article']]);
$nomTracaGroup = $query->fetchAll();

foreach ($nomTracaGroup as $key_1 => $value_1) {
    $itemOfGroup = [];
    foreach ($nomTraca as $key_2 => $value_2) {
        if ($value_2['GROUPE'] == $value_1['ID']) {
            switch ($value_2['TYPE_TRACA']) {
                case 'OF':
                    $sql = "SELECT * FROM t_nom_traca_of WHERE `ID TRACA` = :idTraca";
                    $query = $con->createQuery($sql, ['idTraca' => $value_2['ID']]);
                    break;
                case 'Controle':
                    $sql = "SELECT * FROM t_nom_traca_autocontrole WHERE `ID TRACA` = :idTraca";
                    $query = $con->createQuery($sql, ['idTraca' => $value_2['ID']]);
                    break;
                case 'Matiere':
                    $sql = "SELECT * FROM t_nom_traca_matiere WHERE `ID TRACA` = :idTraca";
                    $query = $con->createQuery($sql, ['idTraca' => $value_2['ID']]);
                    break;
                default:
                    # code...
                    break;
            }
            $details = $query->fetchAll();
            $value_2['details'] = $details;
            array_push($itemOfGroup, $value_2);
        }
    }
    $nomTracaGroup[$key_1]['items'] = $itemOfGroup;
}

// $result = '[';
// foreach ($nomTracaGroup as $key => $value) {
//     $result .= '{ "ID":'.$value['ID'].',"name":"'.$value['DESCRIPTION'].'","shortName":"'.$value['ID_GROUP'].'","ordre":"'.$value['ORDRE'].'","item":[';
//     $listIdTraca = explode(",", $value['LIST ID TRACA']);
//     foreach ($nomTraca as $_key => $_value) {
//         if (in_array($_value['ID'],$listIdTraca)) {
//             $result .= json_encode($_value).',';
//         }
//     }
//     if (substr($result,-1)==",") {
//         $result = substr($result, 0, -1);
//     }

//     $result.=']},';
// }
// $result = substr($result, 0, -1);
// $result .= ']';
echo json_encode($nomTracaGroup);
