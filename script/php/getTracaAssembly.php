<?php

use function PHPSTORM_META\type;

require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT * FROM t_traca WHERE OF = :of AND STATUT <>0";
$query = $con->createQuery($sql, ['of' => $_GET['of']]);
$traca = $query->fetchAll();

$sql = "SELECT * FROM t_nom_traca WHERE ARTICLE = :article AND ID_FAC != 0 ORDER BY `ID_FAC`";
$query = $con->createQuery($sql, ['article' => $_GET['article']]);
$nomTraca = $query->fetchAll();

$sql = "SELECT * FROM t_nom_traca_group WHERE ARTICLE = :article ORDER BY `ORDRE`";
$query = $con->createQuery($sql, ['article' => $_GET['article']]);
$nomTracaGroup = $query->fetchAll();

//pour chaque groupe
foreach ($nomTracaGroup as $key_1 => $group) {
    $itemOfGroup = [];
    $nbGroupItem = 0;
    $nbTraca = 0;
    foreach ($nomTraca as $key => $nomTracaItem) {
        if ($nomTracaItem['GROUPE'] == $group['ID']) {
            $nbGroupItem = $nbGroupItem + 1;

            //var_dump('je fais la traça de : ' . $nomTracaItem['ID']);
            $keyTraca = array_search($nomTracaItem['ID'], array_column($traca, 'ID FAC'));
            switch ($nomTracaItem['TYPE_TRACA']) {
                case 'OF':
                    $sql = "SELECT * FROM t_nom_traca_of WHERE `ID TRACA` = :idTraca";
                    $queryNom = $con->createQuery($sql, ['idTraca' => $nomTracaItem['ID']]);
                    $nomTracaItem['nomTracaDetail'] = $queryNom->fetchAll();
                    foreach ($nomTracaItem['nomTracaDetail'] as $key => $part) {
                        $sql = "SELECT `desSimplifee` FROM t_ref WHERE `numArticleSap` = :numArticleSap";
                        $queryDes = $con->createQuery($sql, ['numArticleSap' => $part['ARTICLE']]);
                        $nomTracaItem['nomTracaDetail'][$key]['DESIGNATION'] = $queryDes->fetchColumn();
                    }
                    break;
                case 'Controle':
                    $sql = "SELECT * FROM t_nom_traca_autocontrole WHERE `ID TRACA` = :idTraca";
                    $queryNom = $con->createQuery($sql, ['idTraca' => $nomTracaItem['ID']]);
                    $nomTracaItem['nomTracaDetail'] = $queryNom->fetchAll();
                    foreach ($nomTracaItem['nomTracaDetail'] as $key => $tool) {
                        $sql = "SELECT `TYPE` FROM t_controltool_type WHERE `ID` = :idTool";
                        $queryDes = $con->createQuery($sql, ['idTool' => $tool['OUTILLAGE']]);
                        $nomTracaItem['nomTracaDetail'][$key]['DESIGNATION'] = $queryDes->fetchColumn();
                    }
                    break;
                case 'Matiere':
                    $sql = "SELECT * FROM t_nom_traca_matiere WHERE `ID TRACA` = :idTraca";
                    $queryNom = $con->createQuery($sql, ['idTraca' => $nomTracaItem['ID']]);
                    $nomTracaItem['nomTracaDetail'] = $queryNom->fetchAll();
                    foreach ($nomTracaItem['nomTracaDetail'] as $key => $Mat) {
                        $sql = "SELECT `DESIGNATION SIMPLIFIEE` FROM t_materials WHERE `ID` = :idMat";
                        $queryDes = $con->createQuery($sql, ['idMat' => $Mat['ARTICLE']]);
                        $nomTracaItem['nomTracaDetail'][$key]['DESIGNATION'] = $queryDes->fetchColumn();
                    }
                    break;
                default:
                    # code...
                    break;
            }

            if (gettype($keyTraca) != 'boolean') {
                $nbTraca = $nbTraca + 1;
                $nomTracaItem['traca'] = $traca[array_search($nomTracaItem['ID'], array_column($traca, 'ID FAC'))];
                switch ($nomTracaItem['TYPE_TRACA']) {
                    case 'OF':
                        $sql = "SELECT * FROM t_traca_of WHERE `ID TRACA` = :idTraca";
                        $queryTraca = $con->createQuery($sql, ['idTraca' => $traca[$keyTraca]['ID']]);
                        break;
                    case 'Controle':
                        $sql = "SELECT * FROM t_traca_controle WHERE `ID TRACA` = :idTraca";
                        $queryTraca = $con->createQuery($sql, ['idTraca' => $traca[$keyTraca]['ID']]);
                        break;
                    case 'Matiere':
                        $sql = "SELECT * FROM t_traca_matiere WHERE `ID TRACA` = :idTraca";
                        $queryTraca = $con->createQuery($sql, ['idTraca' => $traca[$keyTraca]['ID']]);
                        break;
                    default:
                        # code...
                        break;
                }
                $nomTracaItem['traca']['tracaDetails'] = $queryTraca->fetchAll();
                $keyTraca = 'Undefined';
            }
            array_push($itemOfGroup, $nomTracaItem);
        }
    }
    $nomTracaGroup[$key_1]['PROGRESS'] = $nbTraca / $nbGroupItem;
    $nomTracaGroup[$key_1]['items'] = $itemOfGroup;
}

echo json_encode($nomTracaGroup);
