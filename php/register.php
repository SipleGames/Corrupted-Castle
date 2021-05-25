<?php

include("conexion.php");

$nombre = $_POST["username"];
$pass = $_POST["password"];

$sqlgrabar = "INSERT INTO usuarios(nombre_usuario,contrasena) VALUES ('$nombre','$pass')";

if (mysqli_query($conn, $sqlgrabar))
{
	echo "<script> 
			alert('Usuario registrado con exito: $nombre'); 
			window.location='http://localhost/CorruptedCastle/index.html'
		</script>";
}
else
{
	echo "Error: ".$sql."<br>".mysql_error($conn);
}

?>