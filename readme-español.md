Sorteo de la Copa Mundial 2026 (Polla Mundialista) Hecho en Colombia

Esta es una aplicación web creada para organizar el sorteo de la Copa Mundial 2026 en Estados Unidos, México y Canadá.

Cómo funciona El proyecto está construido utilizando HTML y JavaScript puros (sin utilizar marcos extraños). Utiliza una base de datos Supabase gratuita y basada en la nube para almacenar las predicciones.

Pasos para jugar: 1. Abra el archivo «index.html» en su navegador (Chrome, Edge, el que funcione). 2. Introduzca su nombre. 3. Rellene los resultados de los grupos A a L. 4. ATENCIÓN: En la fase eliminatoria, si predice un empate, debe marcar la casilla de verificación de quién gana en los penaltis. 5. Por último, elija el campeón, el subcampeón, el tercer clasificado y el equipo con más goles. 6. Pulse el botón amarillo GUARDAR.

Reglas de puntuación

Puntuación exacta: 5 puntos.
Ganador o empate correcto (puntuación no exacta): 2 puntos.
Puntos especiales finales

CAMPEÓN correcto: 13 puntos.
SUBCAMPEÓN correcto: 10 puntos.
TERCER CLASIFICADO correcto: 6 puntos.
Equipo con más goles correcto: 8 puntos.
Si eres administrador u organizador, estos son los pasos para controlar todo como administrador: 1. Abre una cuenta en Supabase.

2. Crea un nuevo proyecto llamado «mundialscore».

3. Crea dos bases de datos llamadas «predicciones» y «resultados_oficiales».

4. Para «resultados_oficiales», crea una nueva columna llamada «resultados» en formato jsonb.

5. Para «predicciones», crea las siguientes columnas: «fecha» en formato timestampz, «datos_juego» en formato jsonb y «usuario» en formato texto (cadena).

6. Obtenga la URL y la clave de la API y péguelas en el archivo logica.js en las dos primeras VAR.

7. Abra el archivo html de administración en su ordenador y actualice el resultado de los partidos para que el software pueda realizar los cálculos necesarios para actualizar las tablas de clasificación.

Creado por: Alejandro Montoya Versión: 1.0 (diciembre de 2025)

Nota: Las agrupaciones específicas de equipos aún no son definitivas, ya que aún no se ha realizado el sorteo. Por ahora, utilizamos A1, A2, etc. Solo México, Canadá y EE. UU. tienen plazas fijas. El viernes 13 de diciembre se actualizará este código.
