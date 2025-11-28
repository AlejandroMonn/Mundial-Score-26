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
// FUNCION PARA CALCULAR LOS PUNTOS EXTRA
// Valores sacados de mi cuaderno:
// Campeon = 13 pts
// Subcampeon = 10 pts
// 3r puesto = 6 pts
// Goleadora = 8 pts

function calcularPuntosFinales(userCampeon, realCampeon, userSub, realSub, user3ro, real3ro, userGol, realGol) {
    var puntosExtra = 0;

    // Convertimos todo a mayusculas para que no haya problema
    // Ej: "colombia" se vuelve "COLOMBIA"
    userCampeon = userCampeon.toUpperCase().trim();
    realCampeon = realCampeon.toUpperCase().trim();
    userSub = userSub.toUpperCase().trim();
    realSub = realSub.toUpperCase().trim();
    user3ro = user3ro.toUpperCase().trim();
    real3ro = real3ro.toUpperCase().trim();
    userGol = userGol.toUpperCase().trim();
    realGol = realGol.toUpperCase().trim();

    // Lo
    if (userCampeon == realCampeon) {
        puntosExtra = puntosExtra + 13; // 13 puntos al campeon
    }

    if (userSub == realSub) {
        puntosExtra = puntosExtra + 10; // 10 al subcampeon
    }

    if (user3ro == real3ro) {
        puntosExtra = puntosExtra + 6; // 6 al tercero
    }
    
    // Seleccion mas goleadora
    if (userGol == realGol) {
        puntosExtra = puntosExtra + 8; // 8 puntos goleadora
    }
// FUNCION PARA CALCULAR LOS PUNTOS EXTRA
// Valores sacados de mi cuaderno:
// Campeon = 13 pts
// Subcampeon = 10 pts
// 3r puesto = 6 pts
// Goleadora = 8 pts

function calcularPuntosFinales(userCampeon, realCampeon, userSub, realSub, user3ro, real3ro, userGol, realGol) {
    var puntosExtra = 0;

    // Convertimos todo a mayusculas para que no haya problema
    // Ej: "colombia" se vuelve "COLOMBIA"
    userCampeon = userCampeon.toUpperCase().trim();
    realCampeon = realCampeon.toUpperCase().trim();
    userSub = userSub.toUpperCase().trim();
    realSub = realSub.toUpperCase().trim();
    user3ro = user3ro.toUpperCase().trim();
    real3ro = real3ro.toUpperCase().trim();
    userGol = userGol.toUpperCase().trim();
    realGol = realGol.toUpperCase().trim();

    // Logica simple
    if (userCampeon == realCampeon) {
        puntosExtra = puntosExtra + 13; // 13 puntos al campeon
    }

    if (userSub == realSub) {
        puntosExtra = puntosExtra + 10; // 10 al subcampeon
    }

    if (user3ro == real3ro) {
        puntosExtra = puntosExtra + 6; // 6 al tercero
    }
    
    // Seleccion mas goleadora
    if (userGol == realGol) {
        puntosExtra = puntosExtra + 8; // 8 puntos goleadora
    }

    console.log("Puntos extra ganados: " + puntosExtra);
    return puntosExtra;
}
    console.log("Puntos extra ganados: " + puntosExtra);
    return puntosExtra;
}
// FUNCION PRINCIPAL: RECOGER TODO Y GUARDAR
async function guardarDatos() {
    var nombre = localStorage.getItem("nombre_usuario_polla");
    if(!nombre) {
        alert("No tienes nombre! Vuelve al inicio.");
        return;
    }

    console.log("Recolectando datos de " + nombre + "...");
    
    // Objeto gigante donde guardare todo
    var misPredicciones = {};

    // 1. GUARDAR GRUPOS (A hasta L)
    // Hago un array con las letras para recorrerlas
    var grupos = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
    
    for (var i = 0; i < grupos.length; i++) {
        var letra = grupos[i];
        // Son 6 partidos por grupo
        for (var p = 1; p <= 6; p++) {
            // Creo el ID que puse en el HTML: ej "gA_p1_local"
            var idLocal = "g" + letra + "_p" + p + "_local";
            var idVisit = "g" + letra + "_p" + p + "_visit";
            
            var valLocal = document.getElementById(idLocal).value;
            var valVisit = document.getElementById(idVisit).value;

            // Guardo en el objeto
            misPredicciones[idLocal] = valLocal;
            misPredicciones[idVisit] = valVisit;
        }
    }

    // 2. GUARDAR ELIMINATORIAS (16vos)
    // Son 16 partidos
    for (var j = 1; j <= 16; j++) {
        var idL = "goles_16_" + j + "_L";
        var idV = "goles_16_" + j + "_V";
        var idPenalL = "penales_16_" + j + "_L"; // El checkbox
        var idPenalV = "penales_16_" + j + "_V";

        misPredicciones[idL] = document.getElementById(idL).value;
        misPredicciones[idV] = document.getElementById(idV).value;
        
        // Para checkbox se usa .checked
        if(document.getElementById(idPenalL)) {
            misPredicciones[idPenalL] = document.getElementById(idPenalL).checked;
            misPredicciones[idPenalV] = document.getElementById(idPenalV).checked;
        }
    }

    // 3. GUARDAR CAMPEONES (Inputs de texto)
    misPredicciones["campeon"] = document.getElementById("pred_campeon").value;
    misPredicciones["subcampeon"] = document.getElementById("pred_subcampeon").value;
    misPredicciones["tercero"] = document.getElementById("pred_tercero").value;
    misPredicciones["goleadora"] = document.getElementById("pred_goleadora").value;

    console.log("Ya tengo todo, enviando a Supabase...");

    //'predicciones_json' debe ser tipo JSON o TEXT en Supabase
    const { data, error } = await _supabase
        .from('predicciones')
        .insert([
            { 
                usuario: nombre, 
                fecha: new Date(),
                datos_juego: misPredicciones // Aqui va el chorizo de datos
            }
        ]);

    if (error) {
        alert("ERROR: " + error.message);
        console.log(error);
    } else {
        alert("¡LISTO! Tu polla mundialista se guardó. Cruzaré los dedos por ti.");
     
        document.querySelector(".btn-guardar").disabled = true;
        document.querySelector(".btn-guardar").innerText = "GUARDADO";
    }
}

