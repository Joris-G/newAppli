<?php
require 'Connexion.php';
$con = new Connexion();
//On créé une ligne de traca sanction Non-conforme par défaut
$sql = "INSERT INTO t_traca (`ID FAC`, `OF`, `USER`,`STATUT`) VALUES (:idFac,:of,:user,:statut)";
$query = $con->createQuery($sql, ['idFac' => $_GET['idFac'], 'of' => $_GET['of'], 'user' => $_GET['matricules'], 'statut' => 1]);

$sql = "SELECT `ID` FROM t_traca WHERE `ID FAC` = :idFac AND `OF`=:of AND STATUT <>0";
$query = $con->createQuery($sql, ['idFac' => $_GET['idFac'], 'of' => $_GET['of']]);
$idTraca = $query->fetch();

$idTraca = intval($idTraca['ID']);

$matricules = explode(",",$_GET['matricules']);

//USERS
var_dump($idTraca);
foreach ($matricules as $key => $matricule) {
    var_dump($matricule);
    $sql = "INSERT INTO t_traca_users (`ID_TRACA`,`MATRICULE`) VALUES (:idTraca,:matricule)";
    $query = $con->createQuery($sql, ['idTraca' => $idTraca, 'matricule'=>$matricule]);
    $sql = "UPDATE t_user SET `SCORE TRACA` = (`SCORE TRACA` + 1) WHERE MATRICULE = :matricule";
    $query = $con->createQuery($sql, ['matricule'=> $matricule]);
    var_dump($query);
}


//TRACA
switch ($_GET['typeTraca']) {
    case 'MATIERE':
        $listOfPart = json_decode($_GET['listOf'], true);
        foreach ($listOfPart as $key => $part) {
            $sql = "INSERT INTO t_traca_matiere (`ID TRACA`,`ID MAT ENTRY`,`ID_NOM_MATIERE`) VALUES (:idTraca,:idMatEntry,:idNomMatiere)";
            $query = $con->createQuery($sql, ['idTraca' => $idTraca, ':idNomMatiere' => $part['NomTracaOf'], ':idMatEntry' => $part['of']]);
        }
        //ON passe la ligne de traca en conforme
        $sql = "UPDATE t_traca SET `SANCTION`=1 WHERE `ID` = :idTraca";
        $query = $con->createQuery($sql, ['idTraca' => $idTraca]);
        break;
    case 'OF':
        $listOfPart = json_decode($_GET['listOf'], true);
        foreach ($listOfPart as $key => $part) {
            //Compte combien d'OF sont déjà enregistrés
            $sql = "SELECT COUNT(*) FROM t_traca_of WHERE OF  =:of ";
            $query = $con->createQuery($sql, ['of' => $part['of']]);
            $nbOfRecorded = $query->fetch();
            //Récupère le nombre max de pièces fabriquées
            //Récupère l'article concerné par rapport à l'id de traca
            $sql = "SELECT `ARTICLE` FROM t_nom_traca_of WHERE `ID TRACA`  =:idTraca ";
            $query = $con->createQuery($sql, ['idTraca' => $_GET['idFac']]);
            $article = $query->fetchColumn();
            //Somme des ref article dans nom
            $sql = "SELECT SUM(`Quantite`) FROM t_nom_test WHERE Article  =:article ";
            $query = $con->createQuery($sql, ['article' => $article]);
            $nbPieceMax = $query->fetch();

            //Compare
            //Si nbOfFabriqué+1 > nbPieceMax
            if (($nbOfRecorded++) > $nbPieceMax) {
                var_dump('error');
            } else {
                if ($article == "7172242" || $article == "7172275") {
                    $sql = "INSERT INTO t_traca_of (`ID TRACA`,`OF`,`ID_TRACA_OF`,`COMPLEMENT`) VALUES (:idTraca,:of,:idOfTraca,:boxName)";
                    $query = $con->createQuery($sql, ['idTraca' => $idTraca, 'of' => $part['of'], 'idOfTraca' => $part['NomTracaOf'], 'boxName' => $part['boxName']]);
                } else {
                    $sql = "INSERT INTO t_traca_of (`ID TRACA`,`OF`,`ID_TRACA_OF`) VALUES (:idTraca,:of,:idOfTraca)";
                    $query = $con->createQuery($sql, ['idTraca' => $idTraca, 'of' => $part['of'], 'idOfTraca' => $part['NomTracaOf']]);
                }
            }
            //ON passe la ligne de traca en conforme
            $sql = "UPDATE t_traca SET `SANCTION`=1 WHERE `ID` = :idTraca";
            $query = $con->createQuery($sql, ['idTraca' => $idTraca]);
        }

        break;
    case 'Controle':
        $listOfPart = json_decode($_GET['listOf'], true);
        foreach ($listOfPart as $key => $part) {
            $sql = "INSERT INTO t_traca_controle (`ID TRACA`,`ID_NOM_CONTROLE`,`OUTIL`) VALUES (:idTraca,:idTracaControl,:tool)";
            if ($part['of'] == "N/A") {
                $part['of'] = 91;
            }
            $query = $con->createQuery($sql, ['idTraca' => $idTraca, ':idTracaControl' => $part['NomTracaOf'], ':tool' => $part['of']]);
        }
        //ON passe la ligne de traca en conforme
        $sql = "UPDATE t_traca SET `SANCTION`= :sanction WHERE `ID` = :idTraca";
        $query = $con->createQuery($sql, ['idTraca' => $idTraca, 'sanction' => $_GET['sanction']]);
        break;
    default:
        # code...
        break;
}

//SCORE DE L'UTILISATEUR CONNECTE
$sql = "UPDATE t_user SET `SCORE APPLI` = (`SCORE APPLI` + 1) WHERE MATRICULE =:matricule";
$query = $con->createQuery($sql, ['matricule'=> $matricules[0]]);
var_dump($query);