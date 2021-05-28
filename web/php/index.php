<?php
// Activación de errores para depuración
ini_set('display_errors', 1);
error_reporting(E_ALL);

function guardado_bbdd($vida, $direccion, $posicionx, $posiciony) {
  
  include("conexion.php");

  // aqui hace lo necesario para consultar o escribir en la base de datos
  $sqlupdate = "UPDATE jugadores SET direccion = '$direccion', posicionx = '$posicwadionx', posiciony = '$posiciony', vida = '$vida'";

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


$direction = filter_input(INPUT_POST, "direction", FILTER_SANITIZE_STRING);
$vidas = filter_input(INPUT_POST, "vida", FILTER_SANITIZE_STRING);
$positionx= filter_input(INPUT_POST, "positionx", FILTER_SANITIZE_STRING);
$positiony = filter_input(INPUT_POST, "positiony", FILTER_SANITIZE_STRING);
$savegame = filter_input(INPUT_POST, "savegame", FILTER_SANITIZE_STRING);
$oleada = filter_input(INPUT_POST, "oleada", FILTER_SANITIZE_STRING);
$push = filter_input(INPUT_POST, "push", FILTER_SANITIZE_STRING);

$positionx = abs($positionx);
$positiony = abs($positiony);


// respuesta en json
if ($vidas != "" && $direction != "" && $vida != "" && $positionx != "" && $positiony != "" && $push != "")
{
  $data = guardado_bbdd($vidas, $direction, $positionx, $positiony);
  echo "<script> 
      alert('$data'); 
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
        
        <?php
          echo "[NADA]";
        ?>
    </div>
    <h3>No se ha recibido ningún parámetro.</h3>
  </body>
</html>