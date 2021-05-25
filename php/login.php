<?php

include("conexion.php");

$nombre = $_POST["username"];
$pass = $_POST["password"];

$query = mysqli_query($conn, "SELECT * FROM usuarios WHERE nombre_usuario = '".$nombre."' AND contrasena = '".$pass."' ");
$nr = mysqli_num_rows($query);

if ($nr == 1) {
	echo "<script> 
			alert('Bienvenido $nombre'); 
			 window.location='../game.html'
		</script>";

}
else {
	echo "<script> 
			alert('Usuario no existe'); 
			window.location='../index.html'
		</script>";
}

?>