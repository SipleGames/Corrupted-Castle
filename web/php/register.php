<?php

include("conexion.php");

$nombre = $_POST["username"];
$pass = $_POST["password"];

$sqlgrabar = "INSERT INTO jugadores(nombre_usuario,contrasena) VALUES ('$nombre','$pass')";

if (mysqli_query($conn, $sqlgrabar))
{
	echo "<script> 
			alert('Usuario registrado con exito: $nombre'); 
			window.location='../index.html'
		</script>";
}
else
{

	echo "<script> 
			alert('Usuario $nombre ya está registrado. Prueba con otro nombre o inicia sesión'); 
			window.location='../index.html'
		</script>";

	echo "Error: ".$sqli."<br>".mysqli_error($conn);

}

?>