var supabaseUrl = 'https://TU_URL_DE_SUPABASE_AQUI'; 
var supabaseKey = 'TU_PUBLIC_KEY_LARGA_AQUI'; 
var _supabase = supabase.createClient(supabaseUrl, supabaseKey);

console.log("Supabase listo");
var puntos_exacto = 5; 
var puntos_ganador = 2; 
var puntos_campeon = 13;
var puntos_sub = 10;
var puntos_tercero = 6;
var puntos_goleadora = 8;

var currentUser = localStorage.getItem("nombre_usuario_polla");

if (currentUser) {
    var spanNombre = document.getElementById("verNombre");
    if(spanNombre) {
        spanNombre.innerText = currentUser;
    }
}
function guardarNombre() {
    var inputNombre = document.getElementById("nombreUsuario").value;
    
    if (inputNombre == "") {
        alert("Escribe algo por favor!");
        return;
    }
    
    localStorage.setItem("nombre_usuario_polla", inputNombre);
    window.location.href = "juego.html";
}


function calcularPuntosPartido(realL, realV, userL, userV) {
    var puntos = 0;

    if (realL === "" || realV === "" || userL === "" || userV === "") {
        return 0;
    }


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



function calcularPuntosFinales(userCampeon, realCampeon, userSub, realSub, user3ro, real3ro, userGol, realGol) {
    var puntosExtra = 0;

    userCampeon = userCampeon.toUpperCase().trim();
    realCampeon = realCampeon.toUpperCase().trim();


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
    var nombre = localStorage.getItem("nombre_usuario_polla");
    if(!nombre) {
        alert("No tienes nombre! Vuelve al inicio.");
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
        alert("ERROR: Hubo un error al guardar. Revisa la consola para más detalles.");
        console.log("Error de Supabase:", error);
    } else {
        alert("¡LISTO! Tu polla mundialista se guardó. Cruzaré los dedos por ti.");
        document.querySelector(".btn-guardar").disabled = true;
        document.querySelector(".btn-guardar").innerText = "GUARDADO";
    }
}
