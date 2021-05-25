<?php

$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "pruebasphp";

$conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
if (!$conn)
{
	die("No hay conexión: ".mysqli_connect_error());
}

$nombre = $_POST["txtusername"];
$pass = $_POST["txtpassword"];

$query = mysqli_query($conn, "SELECT * FROM usuarios WHERE nombre_usuario = '".$nombre."' AND contrasena = '".$pass."' ");
$nr = mysqli_num_rows($query);

if ($nr == 1) {
	echo "Bienvenido: " .$nombre;

}
else if ($nr == 0) {
	echo "Sos puto";
}

?>