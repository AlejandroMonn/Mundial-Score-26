
var supabaseUrl = 'https://zempomjffaygqjvyvliw.supabase.co; 
var supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplbXBvbWpmZmF5Z3Fqdnl2bGl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MTExNjMsImV4cCI6MjA4MDI4NzE2M30.KEF5h9xAwjAa8Ve93LfipPlxsIbfOWLibOh3jV4mVRw'; 
var _supabase = supabase.createClient(supabaseUrl, supabaseKey);

console.log("Sistema cargado. Conectado a base de datos.");


// Recuperar nombre al iniciar
var currentUser = localStorage.getItem("nombre_usuario_polla");
if (currentUser && document.getElementById("verNombre")) {
    document.getElementById("verNombre").innerText = currentUser;
}

function guardarNombre() {
    var inputNombre = document.getElementById("nombreUsuario").value;
    if (inputNombre == "") { alert("Escribe un nombre!"); return; }
    localStorage.setItem("nombre_usuario_polla", inputNombre);
    window.location.href = "juego.html";
}

// Guardar predicciones del usuario
async function guardarDatos() {
    var nombre = localStorage.getItem("nombre_usuario_polla");
    if(!nombre) { alert("Sin nombre no se puede guardar."); return; }
    
    var misPredicciones = {};


    var inputs = document.getElementsByTagName("input");
    for(var i=0; i<inputs.length; i++) {
        var elId = inputs[i].id;
        // Filtramos por IDs de partidos o predicciones
        if(elId.includes("g") && (elId.includes("_local") || elId.includes("_visit")) || elId.includes("goles_") || elId.includes("penales_") || elId.includes("pred_")) {
            if(inputs[i].type == "checkbox") {
                misPredicciones[elId] = inputs[i].checked;
            } else {
                misPredicciones[elId] = inputs[i].value;
            }
        }
    }
    
    // Explicitamente guardar los premios finales
    misPredicciones["campeon"] = document.getElementById("pred_campeon").value;
    misPredicciones["subcampeon"] = document.getElementById("pred_subcampeon").value;
    misPredicciones["tercero"] = document.getElementById("pred_tercero").value;
    misPredicciones["goleadora"] = document.getElementById("pred_goleadora").value;

    // Enviar a Supabase
    const { data, error } = await _supabase
        .from('predicciones')
        .insert([{ usuario: nombre, fecha: new Date(), datos_juego: misPredicciones }]);

    if (error) {
        alert("Error al guardar: " + error.message);
    } else {
        alert("¡Polla guardada con éxito!");
        document.querySelector(".btn-guardar").disabled = true;
    }
}


async function guardarResultadosOficiales() {
    var password = prompt("Contraseña de Admin:");
    // ⚠️ CAMBIA ESTA CONTRASEÑA ⚠️
    if(password != "admin123") { alert("Contraseña incorrecta"); return; } 

    var resultadosOficiales = {};
    
    // Recoger todos los inputs que terminan en _OFICIAL
    var inputs = document.getElementsByTagName("input");
    for(var i=0; i<inputs.length; i++) {
        if(inputs[i].id.includes("_OFICIAL")) {
            // Guardamos el ID SIN el "_OFICIAL" para poder compararlo facil despues
            var idLimpio = inputs[i].id.replace("_OFICIAL", "");
            
            if(inputs[i].type == "checkbox") {
                resultadosOficiales[idLimpio] = inputs[i].checked;
            } else {
                resultadosOficiales[idLimpio] = inputs[i].value;
            }
        }
    }

    // Guardar en tabla resultados_oficiales (ID 1 siempre, usando UPSERT para actualizar)
    const { data, error } = await _supabase
        .from('resultados_oficiales')
        .upsert({ id: 1, resultados: resultadosOficiales }, { onConflict: 'id' });

    if(error) alert("Error admin: " + error.message);
    else alert("Resultados Oficiales actualizados correctamente.");
}


// Función matematica que compara la polla del usuario vs la oficial
function calcularPuntajeUnico(prediccion, oficial) {
    var total = 0;

    // Recorremos todas las llaves que existen en los resultados oficiales
    for (var key in oficial) {
        
        if (key.includes("_local") && !key.includes("penales")) {
            var keyVisita = key.replace("_local", "_visit");
            
            var realL = parseInt(oficial[key]);
            var realV = parseInt(oficial[keyVisita]);
            var userL = parseInt(prediccion[key]);
            var userV = parseInt(prediccion[keyVisita]);

            if(!isNaN(realL) && !isNaN(realV) && !isNaN(userL) && !isNaN(userV)) {
                // Exacto (5 pts)
                if(realL == userL && realV == userV) {
                    total += 5;
                } 
                else {
                    var ganaReal = Math.sign(realL - realV); // 1 gana local, -1 visita, 0 empate
                    var ganaUser = Math.sign(userL - userV);
                    if(ganaReal == ganaUser) {
                        total += 2;
                    }
                }
            }
        }

        if (key.includes("goles_") && key.endsWith("_L")) {
            var keyVisita = key.replace("_L", "_V");
            var realL = parseInt(oficial[key]);
            var realV = parseInt(oficial[keyVisita]);
            var userL = parseInt(prediccion[key]);
            var userV = parseInt(prediccion[keyVisita]);

            if(!isNaN(realL) && !isNaN(realV) && !isNaN(userL) && !isNaN(userV)) {
                if(realL == userL && realV == userV) {
                    total += 5;
                } else {
                    var ganaReal = Math.sign(realL - realV);
                    var ganaUser = Math.sign(userL - userV);
                    
                    if(ganaReal == 0 && ganaUser == 0) {
                        var idPenalL = key.replace("goles_", "penales_");
                        var penalOficialL = oficial[idPenalL]; // true o false
                        var penalUserL = prediccion[idPenalL];
                        if(penalOficialL === penalUserL) total += 2;
                    } 
                    else if (ganaReal == ganaUser) {
                        total += 2; // Gana el que gana (2 puntos)
                    }
                }
            }
        }
    }

    function compararTexto(campo, pts) {
        if(oficial[campo] && prediccion[campo]) {
            if(oficial[campo].toUpperCase().trim() == prediccion[campo].toUpperCase().trim()) {
                total += pts;
            }
        }
    }

    compararTexto("campeon", 13);
    compararTexto("subcampeon", 10);
    compararTexto("tercero", 6);
    compararTexto("goleadora", 8);

    return total;
}
