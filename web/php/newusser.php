<?php


  // Activación de errores para depuración
  ini_set('display_errors', 1);
  error_reporting(E_ALL);

  function alta_usuario_bbdd( $usuario, $contrasenya ) {

    //Conexion a la BBDD
  include("conexion.php");

    // aqui hace lo necesario para consultar o escribir en la base de datos
    
    $sqlgrabar = "INSERT INTO usuarios(nombre_usuario,contrasena) VALUES ('$usuario','$contrasenya')";

    if (mysqli_query($conn, $sqlgrabar))
    {
      return 1;
    }
    else
    {
      return 0;
    }
  }

  // Permite peticiones php desde culquien origen
  // esto deberia de delimitarse solo a la url del juego
  header('Access-Control-Allow-Origin: *');

  // Comprobamos si se han recibido parámetros
  if ( !isset( $HTTP_RAW_POST_DATA ) ) { 
      $HTTP_RAW_POST_DATA = file_get_contents( 'php://input' );
  } 

  $nombre = filter_input(INPUT_POST, "username", FILTER_SANITIZE_STRING);
  $pass = filter_input(INPUT_POST, "password", FILTER_SANITIZE_STRING);

  // respuesta en json
  if ( $nombre != "" && $pass != "" ) {
    header('Content-type: aplication/json');
    $respuesta = alta_usuario_bbdd( $nombre, $pass );
    echo json_encode($respuesta);
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


        <?php
          echo "[".$respuesta."]";
        ?>

        <?php
          echo "Espera recibir un usuario y una contraseña]";
        ?>
    </div>
    <h3>No se ha recibido ningún parámetro.</h3>
  </body>
</html>