
function loadEvents()
{
	document.getElementById("SignOn").addEventListener('click', getRegistred);
}

function getRegistred() {

	var username = document.getElementById('txtusername').value;
	var password = document.getElementById('txtpassword').value;
	var urlllamada = 'http://localhost/CorruptedCastle/web/php/newusser.php';

	//https://php-server.siplegames.repl.co/index.php
	xhr = new XMLHttpRequest();

	xhr.open('POST', urlllamada);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	// Acciones a procesar tras recibir la respuesta
	xhr.onload = function xhrOnload()
	{
		console.log('Tenemos al bicho: ' + xhr.$respuesta);
	  if (xhr.respuestaRegister == 'undefined') {
	    
	    alert("Usuario " + username + " registrado correctamente");
	    
	  }
	  else {
	    console.log('Algo ha fallado: ' + xhr.status);
	    alert(username + " ya esta registrado, introduce un nombre valido");
	  }
	}
	// Envia datos al servidor php
	var datos = 'Usuario= ' + username + ' Password= ' + password;
	// Debug
	console.log(datos);
	var datoscodificados = encodeURI(datos);
	console.log(datoscodificados);
	xhr.send(datoscodificados);
}