
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

async function guardarDatos() {
    var nombre = localStorage.getItem("nombre_usuario_polla");
    if(!nombre) { alert("Sin nombre no se puede guardar."); return; }
    
    var misPredicciones = {};

    var inputs = document.getElementsByTagName("input");
    for(var i=0; i<inputs.length; i++) {
        var elId = inputs[i].id;
        if(elId.includes("g") && (elId.includes("_local") || elId.includes("_visit")) || elId.includes("goles_") || elId.includes("penales_") || elId.includes("pred_")) {
            if(inputs[i].type == "checkbox") {
                misPredicciones[elId] = inputs[i].checked;
            } else {
                misPredicciones[elId] = inputs[i].value;
            }
        }
    }
    )
    misPredicciones["campeon"] = document.getElementById("pred_campeon").value;
    misPredicciones["subcampeon"] = document.getElementById("pred_subcampeon").value;
    misPredicciones["tercero"] = document.getElementById("pred_tercero").value;
    misPredicciones["goleadora"] = document.getElementById("pred_goleadora").value;

    // Enviar a Supabase (se mantiene el ID de usuario)
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
    
    var inputs = document.getElementsByTagName("input");
    for(var i=0; i<inputs.length; i++) {
        if(inputs[i].id.includes("_OFICIAL")) {
           
            var idLimpio = inputs[i].id.replace("_OFICIAL", "");
            
            if(inputs[i].type == "checkbox") {
                resultadosOficiales[idLimpio] = inputs[i].checked;
            } else {
                resultadosOficiales[idLimpio] = inputs[i].value;
            }
        }
    }

    const { data, error } = await _supabase
        .from('resultados_oficiales')
        .upsert({ id: 1, resultados: resultadosOficiales }, { onConflict: 'id' });

    if(error) alert("Error admin: " + error.message);
    else alert("Resultados Oficiales actualizados correctamente.");
}
