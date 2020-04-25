<?php

$serverName='DESKTOP-IIQEH5N\SQLEXPRESS';
$connectionInfo = array("Database"=>"ONE_PIECE_PLUS", "UID"=>"vdeserto","PWD"=>"123456","CharacterSet"=>"UTF-8");
$conn_sis = sqlsrv_connect($serverName,$connectionInfo);

if($conn_sis){
    echo "Conexao realizada com sucesso";
}
else{
    echo "Falha na conexao";
    die(print_r(sqlsrv_errors(), true));
}


?>