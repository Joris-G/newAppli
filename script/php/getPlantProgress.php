<?php
require 'Connexion.php';
$con = new Connexion();

// les niveau 0 du programme
$sql = "SELECT * FROM t_nom_test WHERE PROGRAMME = :program AND Niveau = :niveau";
$query = $con->createQuery($sql, ['program' => $_GET['program'], 'niveau' => 0]);
$assemblyLines = $query->fetchAll();
$plantProgress = [];

foreach ($assemblyLines as $keyLines => $lines) {
    $plantProgress[$keyLines]['article'] = $lines['Article'];
    $plantProgress[$keyLines]['designation'] = $lines['Designation'];
    $plantProgress[$keyLines]['aircraftInProgress'] = [];

    $aircraftInProgress = [];
    $sql = "SELECT * FROM t_traca_assy WHERE `ARTICLE PERE` = :articlePere";
    $query = $con->createQuery($sql, ['articlePere' => $lines['Article']]);
    $aircraftInProgress = $query->fetchAll();
    $plantProgress[$keyLines]['aircraftInProgress'][$keyLines] = $aircraftInProgress;

    $sql = "SELECT * FROM t_nom_test WHERE Parent = :parent";
    $query = $con->createQuery($sql, ['parent' => $lines['Article']]);
}


// // les articles lancés de chaque niveau 0
// foreach ($assemblyLines as $key => $lines) {
//     $sql = "SELECT * FROM t_traca_assy WHERE `ARTICLE PERE` = :articlePere";
//     $query = $con->createQuery($sql, ['articlePere' => $lines['Article']]);
//     $assemblyLines[$key]['Articles fils'] = $query->fetchAll();
//     //l'avancement de chaque fils
//     foreach ($assemblyLines[$key]['Articles fils'] as $key_fils => $articleFils) {
//         $article = $articleFils['ARTICLE FILS'];
//         $of = $articleFils['OF FILS'];
//         $ch = curl_init();
//         $url = "http://localhost/newAppli/script/php/getTracaAssembly.php?of=" . $of . "&article=" . $article;
//         curl_setopt($ch, CURLOPT_URL, $url);
//         curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//         $output = curl_exec($ch);
//         $info = curl_getinfo($ch);
//         curl_close($ch);
//         $result1 = json_decode($output, true);
//         //var_dump($result1);
//         $sumProgressArticleFils = 0.00;
//         $progressArticleFils=0;
//         if ($result1) {
//             foreach ($result1 as $keyRes1 => $value) {
//                 $sumProgressArticleFils += $value['PROGRESS'];
//             }
//             $progressArticleFils = $sumProgressArticleFils / count($result1);
//         }
//         $assemblyLines[$key]['PROGRESS'] = $progressArticleFils;
//     }
// }
echo json_encode($plantProgress);
