<?php
// Activación de errores para depuración
ini_set('display_errors', 1);
error_reporting(E_ALL);

function consulta_bbdd() {
  // aqui hace lo necesario para consultar o escribir en la base de datos
  $datos = array();
  $response[0] = array(
    'id' => '1',
    'valor1'=> 'v1',
    'valor2'=> 'v2'
  );
  return $datos;
}

// Permite peticiones php desde culquien origen
// esto deberia de delimitarse solo a la url del juego
header('Access-Control-Allow-Origin: *');

// Comprobamos si se han recibido parámetros
if ( !isset( $HTTP_RAW_POST_DATA ) ) { 
    $HTTP_RAW_POST_DATA = file_get_contents( 'php://input' );
} 


$direction = filter_input(INPUT_POST, "direction", FILTER_SANITIZE_STRING);
$vida = filter_input(INPUT_POST, "vida", FILTER_SANITIZE_STRING);
$oleada = filter_input(INPUT_POST, "oleada", FILTER_SANITIZE_STRING);

// respuesta en json
if ($vida != "" && $direction != "" && $oleada != "") {
  
  echo "Se han recibido todos los parámetros<br>";
  echo "Parametro 'vida' = $vida<br>";
  echo "Parametro 'direction' = $direction<br>";
  echo "Parametro 'oleada' = $oleada<br>";
  
  header('Content-type: application/json');
  $data = consulta_bbdd();
  echo json_encode( $data );
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