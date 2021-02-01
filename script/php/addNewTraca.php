<?php
require 'Connexion.php';
$con = new Connexion();

$sql = "INSERT INTO t_nom_traca (`ID_FAC`,`ARTICLE`,`GROUPE`, `TYPE_TRACA`, `INSTRUCTIONS`) VALUES (:idFAC,:article,:group,:typeTraca,:instructions)";
$query = $con->createQuery($sql, ['idFAC' => $_GET['idFAC'], 'article' => $_GET['article'], 'group' => $_GET['group'], 'typeTraca' => $_GET['typeTraca'], 'instructions' => $_GET['instructions']]);

$sql = "SELECT ID FROM t_nom_traca WHERE `ID_FAC` =:idFAC AND `ARTICLE`=:article";
$query = $con->createQuery($sql, ['idFAC' => $_GET['idFAC'], 'article' => $_GET['article']]);
$idTraca = $query->fetch();

$idTracaBis = implode($idTraca);
switch ($_GET['typeTraca']) {
    case 'Matiere':
        $sql = "INSERT INTO t_nom_traca_matiere (`ID TRACA`,`ARTICLE`) VALUES (:idtraca,:material)";
        $query = $con->createQuery($sql, ['idtraca' => implode($idTraca), 'material' => $_GET['material']]);
        break;
    case 'OF':
        $table = json_decode($_GET['partList'], true);
        foreach ($table as $key => $value) {
            var_dump(implode($idTraca));
            $sql = "INSERT INTO t_nom_traca_of (`ID TRACA`,`ARTICLE`,`QUANTITE`) VALUES (:idtraca,:article,:quantite)";
            $query = $con->createQuery($sql, ['idtraca' => implode($idTraca), 'article' => $value['article'], 'quantite' => $value['quantity']]);
        }
        break;
    case 'Controle':
        $needTool = 0;
        if ($_GET['tool'] != null) {
            $needTool = 1;
        };
        $sql = "INSERT INTO t_nom_traca_autocontrole (`ID TRACA`,`NeedTool`,`OUTILLAGE`,`ROLE`) VALUES (:idtraca,:needtool,:toolId,:rol)";
        $query = $con->createQuery($sql, ['idtraca' => implode($idTraca), 'needtool' => $needTool, 'toolId' => $_GET['tool'], 'rol' => $_GET['role']]);
        break;
    default:
        var_dump('try again');
        break;
}
