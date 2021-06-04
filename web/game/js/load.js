function loadRegistred()
{
	document.getElementById("SignOn").addEventListener('click', getRegistred);
}

function loadLogin()
{
	document.getElementById("LogIn").addEventListener('click', getLoged);
}

function getRegistred() {

	var username = document.getElementsByName("username").value;
	var password = document.getElementsByName("password").value;
	var urlllamada = 'http://localhost/CorruptedCastle/web/php/newusser.php';

	if (username.length > 0 && password.length > 0)
	{
		xhr = new XMLHttpRequest();

		xhr.open('POST', urlllamada);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

		// Acciones a procesar tras recibir la respuesta
		xhr.onload = function xhrOnload()
	    {
	      if (xhr.status === 200) {
	        console.log('Respuesta recibida: ' + xhr.responseText);
	      }
	      else if (xhr.status !== 200) {
	        console.log('Algo ha fallado: ' + xhr.status);
	      }
	    }
		
		// Envia datos al servidor php
		var datos = 'username= ' + username + ' password= ' + password;
		// Debug
		console.log(datos);
		//var datoscodificados = encodeURI(datos);
		//console.log(datoscodificados);
		xhr.send(datos);
	}
}

function getLoged() {

	var username = document.getElementsByName("username").value;
	var password = document.getElementsByName("password").value;
	var urlllamada = 'http://localhost/CorruptedCastle/web/php/login.php';

	if (username.length > 0 && password.length > 0)
	{
		//https://php-server.siplegames.repl.co/index.php
		xhr = new XMLHttpRequest();

		xhr.open('POST', urlllamada);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

		// Acciones a procesar tras recibir la respuesta
		xhr.onload = function xhrOnload()
	    {
	      if (xhr.status === 200) {
	        console.log('Respuesta recibida: ' + xhr.responseText);
	      }
	      else if (xhr.status !== 200) {
	        console.log('Algo ha fallado: ' + xhr.status);
	      }
	    }
		
		// Envia datos al servidor php
		var datos = 'Usuario= ' + username + ' Password= ' + password;
		// Debug
		console.log(datos);
		//var datoscodificados = encodeURI(datos);
		//console.log(datoscodificados);
		xhr.send(datos);
	}
}