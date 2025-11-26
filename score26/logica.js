// Archivo de logica para la polla
// Version 1.0

console.log("Entrando a la logica...");

// Recuperar el nombre del usuario si ya existe
var currentUser = localStorage.getItem("nombre_usuario_polla");

if (currentUser) {

    var spanNombre = document.getElementById("verNombre");
    if(spanNombre) {
        spanNombre.innerText = currentUser;
    }
} else {
    console.log("No hay usuario todavia");
}

function guardarNombre() {
    var inputNombre = document.getElementById("nombreUsuario").value;
    
    if (inputNombre == "") {
        alert("Escribe algo por favor!");
        return;
    }
    
   
    localStorage.setItem("nombre_usuario_polla", inputNombre);
    alert("Bienvenido " + inputNombre + ", ahora te redirijo al juego.");
    
   
    window.location.href = "juego.html";
}


var puntos_exacto = 5; 
var puntos_ganador = 2; 
var puntos_campeon = 13;

console.log("Configuracion cargada.");


function calcularPuntosPartido(realL, realV, userL, userV) {
    var puntos = 0;

    
    realL = parseInt(realL);
    realV = parseInt(realV);
    userL = parseInt(userL);
    userV = parseInt(userV);

   
    if (realL == userL && realV == userV) {
        puntos = 5;
        return puntos; 
    }


    
    var ganadorReal = "";
    if (realL > realV) {
        ganadorReal = "LOCAL";
    } else if (realV > realL) {
        ganadorReal = "VISITA";
    } else {
        ganadorReal = "EMPATE";
    }

    var ganadorUser = "";
    if (userL > userV) {
        ganadorUser = "LOCAL";
    } else if (userV > userL) {
        ganadorUser = "VISITA";
    } else {
        ganadorUser = "EMPATE";
    }


    if (ganadorReal == ganadorUser) {
        puntos = 2;
    }

    return puntos;
}

