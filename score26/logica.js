// Archivo de logica para la polla
// Version 1.0

console.log("Entrando a la logica...");

// Recuperar el nombre del usuario si ya existe
var currentUser = localStorage.getItem("nombre_usuario_polla");

if (currentUser) {
    // Si ya hay nombre, lo ponemos en el HTML
    var spanNombre = document.getElementById("verNombre");
    if(spanNombre) {
        spanNombre.innerText = currentUser;
    }
} else {
    console.log("No hay usuario todavia");
}

// Funcion para guardar el nombre desde el index
function guardarNombre() {
    var inputNombre = document.getElementById("nombreUsuario").value;
    
    if (inputNombre == "") {
        alert("Escribe algo por favor!");
        return;
    }
    
    // Guardamos en el navegador
    localStorage.setItem("nombre_usuario_polla", inputNombre);
    alert("Bienvenido " + inputNombre + ", ahora te redirijo al juego.");
    
    // Ir a la pagina del juego
    window.location.href = "juego.html";
}

// Probando si funcionan las variables globales
var puntos_exacto = 5; // Segun la hoja de papel
var puntos_ganador = 2; 
var puntos_campeon = 13;

console.log("Configuracion cargada.");
