
var supabaseUrl = not yet
var supabaseKey = not yet
var _supabase = supabase.createClient(supabaseUrl, supabaseKey);

console.log("Supabase listo");

var puntos_exacto = 5; 
var puntos_ganador = 2; 
var puntos_campeon = 13;
var puntos_sub = 10;
var puntos_tercero = 6;
var puntos_goleadora = 8;

var currentUser = localStorage.getItem("user_name_polla");

if (currentUser) {
    var spanNombre = document.getElementById("seeName");
    if(spanNombre) {
        spanNombre.innerText = currentUser;
    }
}

function guardarNombre() {
    var inputNombre = document.getElementById("UserName").value;
    
    if (inputNombre == "") {
        alert("Escribe algo por favor!");
        return;
    }
    
    localStorage.setItem("user_name_polla", inputNombre);
    window.location.href = "juego.html";
}


// Funcion para calcular cuantos puntos gana el usuario en un partido (Commit 8, 9)
function calcularPuntosPartido(realL, realV, userL, userV) {
    var puntos = 0;

    // FIX: A veces llega vacio y da error NaN
    if (realL === "" || realV === "" || userL === "" || userV === "") {
        return 0;
    }

    // Convertir a numero 
    realL = Number(realL);
    realV = Number(realV);
    userL = Number(userL);
    userV = Number(userV);

    // 1. REGLA: Resultado Exacto = 5 puntos
    if (realL == userL && realV == userV) {
        puntos = 5;
        return puntos; 
    }

    // 2. REGLA: Ganador Partido = 2 puntos
    var ganadorReal = "";
    if (realL > realV) {
        ganadorReal = "LOCAL";
    } else if (realV > realL) {
        ganadorReal = "VISITOR";
    } else {
        ganadorReal = "TIE";
    }

    var ganadorUser = "";
    if (userL > userV) {
        ganadorUser = "LOCAL";
    } else if (userV > userL) {
        ganadorUser = "VISITOR";
    } else {
        ganadorUser = "TIE";
    }

    if (ganadorReal == ganadorUser) {
        puntos = 2;
    }

    return puntos;
}


// FUNCION PARA CALCULAR LOS PUNTOS EXTRA (Commit 15)
function calcularPuntosFinales(userCampeon, realCampeon, userSub, realSub, user3ro, real3ro, userGol, realGol) {
    var puntosExtra = 0;

    // Convertimos todo a mayusculas para que no haya problema
    userCampeon = userCampeon.toUpperCase().trim();
    realCampeon = realCampeon.toUpperCase().trim();
    // ... (rest of conversions) ...

    if (userCampeon == realCampeon) {
        puntosExtra = puntosExtra + puntos_campeon; 
    }
    if (userSub == realSub) {
        puntosExtra = puntosExtra + puntos_sub; 
    }
    if (user3ro == real3ro) {
        puntosExtra = puntosExtra + puntos_tercero; 
    }
    if (userGol == realGol) {
        puntosExtra = puntosExtra + puntos_goleadora; 
    }

    return puntosExtra;
}


// FUNCION PRINCIPAL: RECOGER TODO Y GUARDAR (Commit 18)
async function guardarDatos() {
    var nombre = localStorage.getItem("user_name_polla");
    if(!nombre) {
        alert("YOU DON HAVE A NAME, GO BACK TO THE BEGINING");
        return;
    }
    
    var misPredicciones = {};

    // 1. GUARDAR GRUPOS (A hasta L)
    var grupos = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
    
    for (var i = 0; i < grupos.length; i++) {
        var letra = grupos[i];
        for (var p = 1; p <= 6; p++) {
            var idLocal = "g" + letra + "_p" + p + "_local";
            var idVisit = "g" + letra + "_p" + p + "_visit";
            
            var valLocal = document.getElementById(idLocal).value;
            var valVisit = document.getElementById(idVisit).value;

            misPredicciones[idLocal] = valLocal;
            misPredicciones[idVisit] = valVisit;
        }
    }

    // 2. GUARDAR ELIMINATORIAS (16vos)
    for (var j = 1; j <= 16; j++) {
        var idL = "goles_16_" + j + "_L";
        var idV = "goles_16_" + j + "_V";
        var idPenalL = "penales_16_" + j + "_L";
        var idPenalV = "penales_16_" + j + "_V";

        misPredicciones[idL] = document.getElementById(idL).value;
        misPredicciones[idV] = document.getElementById(idV).value;
        
        if(document.getElementById(idPenalL)) {
            misPredicciones[idPenalL] = document.getElementById(idPenalL).checked;
            misPredicciones[idPenalV] = document.getElementById(idPenalV).checked;
        }
    }

    // 3. GUARDAR CAMPEONES
    misPredicciones["campeon"] = document.getElementById("pred_campeon").value;
    misPredicciones["subcampeon"] = document.getElementById("pred_subcampeon").value;
    misPredicciones["tercero"] = document.getElementById("pred_tercero").value;
    misPredicciones["goleadora"] = document.getElementById("pred_goleadora").value;

    console.log("Ya tengo todo, enviando a Supabase...");

    // ENVIAR A LA BASE DE DATOS
    // Asegúrate de tener una tabla 'predicciones' en Supabase con columnas 'usuario', 'fecha', 'datos_juego' (tipo JSON)
    const { data, error } = await _supabase
        .from('predicciones')
        .insert([
            { 
                usuario: nombre, 
                fecha: new Date(),
                datos_juego: misPredicciones
            }
        ]);

    if (error) {
        alert("ERROR: An error happened saving the data, chech it on the cpnsole ( f12 )");
        console.log("Error of Supabase:", error);
    } else {
        alert("¡LISTO! Succesfully saved");
        document.querySelector(".btn-guardar").disabled = true;
        document.querySelector(".btn-guardar").innerText = "Saved";
    }
}
