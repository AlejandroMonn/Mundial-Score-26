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


    if (realL === "" || realV === "" || userL === "" || userV === "") {
        console.log("Faltan datos en este partido");
        return 0;
    }
    realL = Number(realL);
    realV = Number(realV);
    userL = Number(userL);
    userV = Number(userV);


}

// Ahora si conecta. Vi un tutorial de un indu que explicaba bien.
// CONEXION A SUPABASE
var supabaseUrl = 'https://TU_PROYECTO.supabase.co'; 
var supabaseKey = 'TU_PUBLIC_KEY_LARGA_AQUI'; // OJO: NO BORRAR ESTA CLAVE O DEJA DE FUNCIONAR
var _supabase = supabase.createClient(supabaseUrl, supabaseKey);

console.log("Supabase listo");

// Funcion para guardar el usuario en la tabla 'usuarios'
// Tuve que crear la tabla en la pagina web primero
async function guardarUsuarioEnNube(nombre) {
    console.log("Guardando a: " + nombre);
    
    const { data, error } = await _supabase
        .from('usuarios')
        .insert([
            { nombre_completo: nombre, fecha_registro: new Date() },
        ]);
        
    if (error) {
        console.log("Error guardando: " + error.message);
        alert("Hubo un error guardando tu usuario.");
    } else {
        console.log("Usuario guardado en la nube!");
    }
}

