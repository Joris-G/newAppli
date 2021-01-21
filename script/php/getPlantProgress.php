<?php
require 'Connexion.php';
$con = new Connexion();

// les niveau 0 du programme
$sql = "SELECT * FROM t_nom_test WHERE PROGRAMME = :program AND Niveau = :niveau";
$query = $con->createQuery($sql, ['program' => $_GET['program'], 'niveau' => 0]);
$result = $query->fetchAll();

// les articles lancés de chaque niveau 0
foreach ($result as $key => $level0) {
    $sql = "SELECT * FROM t_traca_assy WHERE `ARTICLE PERE` = :articlePere";
    $query = $con->createQuery($sql, ['articlePere' => $level0['Article']]);
    $result[$key]['Articles fils'] = $query->fetchAll();
    //l'avancement de chaque fils
    foreach ($result[$key]['Articles fils'] as $key_fils => $articleFils) {
        $article = $articleFils['ARTICLE FILS'];
        $of = $articleFils['OF FILS'];
        //var_dump($article, $of);
        $ch = curl_init();
        $url = "http://localhost/newAppli/script/php/getTracaAssembly.php?of=" . $of . "&article=" . $article;
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $output = curl_exec($ch);
        $info = curl_getinfo($ch);
        //var_dump($info);
        curl_close($ch);
        $result1 = json_decode($output, true);
        $sumProgressArticleFils = 0.00;
        foreach ($result1 as $keyRes1 => $value) {
            $sumProgressArticleFils += $value['PROGRESS'];
        }
        var_dump($sumProgressArticleFils);
        $progressArticleFils = $sumProgressArticleFils / count($result1);
        var_dump($progressArticleFils);
        $result[$key]['PROGRESS'] = $progressArticleFils;
    }
}


echo json_encode($result);
