<?php
    // check for ajax
    if(isset($_POST['ajax'])) {
        // connect to db
        $conn_string = "host=ec2-174-129-1-179.compute-1.amazonaws.com port=5432 dbname=d6e1frjth87pfd user=cizbwdxggeralb password=Vxbh0ac32QujliNdiV74wBe11N sslmode=require";
        $conn = pg_connect($conn_string);
        
        if ($conn) {
            $query = "INSERT INTO high_score (map, player, wave, score) VALUES ('{$_POST['map']}', '{$_POST['player']}', {$_POST['wave']}, {$_POST['score']})";
            pg_query($conn, $query);
            echo 'ok';
        }
        else {
            echo 'error';
        }

        exit();
    }
    
    echo 'error';
    
    