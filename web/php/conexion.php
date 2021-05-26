<?php

$dbhost = "sql11.freemysqlhosting.net";
$dbuser = "sql11415078";
$dbpass = "1G2zn97MHC";
$dbname = "sql11415078";

$conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
if (!$conn)
{
	die("No hay conexión: ".mysqli_connect_error());
}

?>