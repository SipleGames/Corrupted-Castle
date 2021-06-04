<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

  function alta_usuario_bbdd( $usuario, $contrasenya ) {

    include("conexion.php");

    $query = mysqli_query($conn, "SELECT * FROM jugadores WHERE nombre_usuario = '".$usuario."'");
    $nr = mysqli_num_rows($query);

    if ($nr == 1)
    {
      return "Nombre de usuario $usuario ya exite, introduce un nombre válido.";
    }
    else
    {
      $sqlgrabar = "INSERT INTO jugadores(nombre_usuario,contrasena) VALUES ('$usuario','$contrasenya')";
      if (mysqli_query($conn, $sqlgrabar))
      {
        return "Registro completado, nombre usuario: $usuario.";
      }
      else
      {
        return "Error de registro.";
      }
    } 
    
  }

  // Permite peticiones php desde culquien origen
  // esto deberia de delimitarse solo a la url del juego
  header('Access-Control-Allow-Origin: ');

  // Comprobamos si se han recibido parámetros
  if ( !isset( $HTTP_RAW_POST_DATA ) ) { 
      $HTTP_RAW_POST_DATA = file_get_contents( 'php://input' );
  } 

  $nombre = filter_input(INPUT_POST, "username", FILTER_SANITIZE_STRING);
  $pass = filter_input(INPUT_POST, "password", FILTER_SANITIZE_STRING);

  // respuesta en alerta
  if ( $nombre != "" && $pass != "" ) {
    $respuesta = alta_usuario_bbdd($nombre, $pass);
    echo "<script> 
      alert('$respuesta'); 
      window.location='../index.html'
    </script>";
    exit;
  }
?>


<html>
  <head>
    <title>newuser.php</title>
  </head>
  <body>
    <h1>php database interface for Corrupted Castle</h1>
    <div>
        Este sitio web no funciona por si solo.<br>
        Espera recibir una petición AJAX del juego.<br><br>
    </div>
    <h3>No se ha recibido ningún parámetro.</h3>
  </body>
</html>