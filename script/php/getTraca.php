<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT * FROM t_nom_traca WHERE ID = :idTraca";
$query = $con->createQuery($sql, ['idTraca' => $_GET['idTraca']]);
$traca = $query->fetch();
switch ($traca['TYPE_TRACA']) {
    case "Matiere":
        $sql = "SELECT * FROM t_nom_traca_matiere WHERE `ID TRACA` = :idTraca";
        $query = $con->createQuery($sql, ['idTraca' => $_GET['idTraca']]);
        $result = $query->fetchAll();

        break;
    case "Controle":
        $sql = "SELECT * FROM t_nom_traca_autocontrole WHERE `ID TRACA` = :idTraca";
        $query = $con->createQuery($sql, ['idTraca' => $_GET['idTraca']]);
        $result = $query->fetchAll();

        break;
    case "OF":
        $sql = "SELECT * FROM t_nom_traca_OF WHERE `ID TRACA` = :idTraca";
        $query = $con->createQuery($sql, ['idTraca' => $_GET['idTraca']]);
        $traca = $query->fetchAll();
        foreach ($traca as $key => $value) {
            $sql = "SELECT `DESIGNATION` FROM t_nom_test WHERE `Article`= :article";
            $query = $con->createQuery($sql, ['article' => $value['ARTICLE']]);
            $designation = $query->fetchColumn();
            $traca[$key]['DESIGNATION'] = $designation;
        }
        $result = $traca;
        break;
    case "Auto-controle":
        $sql = "SELECT * FROM t_nom_traca_autocontrole WHERE `ID TRACA` = :idTraca";
        $query = $con->createQuery($sql, ['idTraca' => $_GET['idTraca']]);
        $result = $query->fetchAll();

        break;
    default:
        # code...
        break;
}
echo json_encode($result);
