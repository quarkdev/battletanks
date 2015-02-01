<?php

// connect to db
$conn_string = "host=ec2-174-129-1-179.compute-1.amazonaws.com port=5432 dbname=d6e1frjth87pfd user=cizbwdxggeralb password=Vxbh0ac32QujliNdiV74wBe11N sslmode=require";
$conn = pg_connect($conn_string);

if ($conn) {
    $query = "SELECT * FROM high_score";
    $result = pg_query($conn, $query);
    
    foreach ($result as $row) {
        echo $row->id;
        echo $row->map;
        echo $row->player;
        echo $row->wave;
        echo $row->score;
    }
    
    echo 'yes';
}

if ($conn === false) {
    echo 'failed';
}