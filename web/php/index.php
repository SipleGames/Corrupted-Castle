<?php
  // Activación de errores para depuración
  ini_set('display_errors', 1);
  error_reporting(E_ALL);

  function guardado_bbdd($vida, $direccion, $posicionx, $posiciony) {
    
    include("conexion.php");


    // aqui hace lo necesario para consultar o escribir en la base de datos
    $sqlupdate = "UPDATE jugadores SET direccion = '$direccion', posicionx = '$posicionx', posiciony = '$posiciony', vida = '$vida' WHERE codigo = '3'";

      if (mysqli_query($conn, $sqlupdate))
      {
        return "Guardadado correctamente";
      }
      else
      {
        return "El guardadado ha fallado";
      }
      
  }

  // Permite peticiones php desde culquien origen
  // esto deberia de delimitarse solo a la url del juego
  header('Access-Control-Allow-Origin: ');

  // Comprobamos si se han recibido parámetros
  if ( !isset( $HTTP_RAW_POST_DATA ) ) { 
      $HTTP_RAW_POST_DATA = file_get_contents( 'php://input' );
  } 


  $direction = filter_input(INPUT_POST, "directions", FILTER_SANITIZE_STRING);
  $vida = filter_input(INPUT_POST, "vida", FILTER_SANITIZE_STRING);
  $positionx = filter_input(INPUT_POST, "positionx", FILTER_SANITIZE_STRING);
  $positiony = filter_input(INPUT_POST, "positiony", FILTER_SANITIZE_STRING);

  //$positionX = abs($positionx);
  //$positionY = abs($positiony);


  // respuesta en json
  if ($direction != "" && $vida != "" && $positionx != "" && $positiony != "")
  {
      echo "<script> 
        alert('Parametros recibidos'); 
      </script>";

    $data = guardado_bbdd($vida, $direction, $positionx, $positiony);
    echo "<script> 
        alert('$data'); 
      </script>";
    exit;
  }
  else
  {
    echo "<script> 
        alert('Parametros no recibidos'); 
      </script>";
      exit;
  }
?>

<html>
  <head>
    <title>PHP Webservice</title>
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