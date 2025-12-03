2026 World Cup Pool (Polla Mundialista) 🇨🇴

This is a web application created to run the pool (sweepstakes) for the 2026 World Cup in the USA, Mexico, and Canada.

How It Works
The project is built using pure HTML and JavaScript (no weird frameworks used).
It uses a free, cloud-based **Supabase** database to store predictions.

Steps to Play
1. Open the `index.html` file in your browser (Chrome, Edge, whatever works).
2. Enter your name.
3. Fill in the scores for Groups A through L.
4. **ATTENTION:** In the knockout stage, if you predict a draw, you **must** mark the checkbox for who wins in penalties.
5. Finally, choose the Champion, Runner-up, Third Place, and Top Goal-Scoring Team.
6. Hit the yellow **SAVE** button.

Scoring Rules
- Exact Score: 5 points
- Correct Winner or Draw (non-exact score): 2 points

Special Final Points
- Correct CHAMPION: 13 points
- Correct RUNNER-UP: 10 points
- Correct THIRD PLACE: 6 points
- Correct Top Goal-Scoring Team: 8 points

**If you are a adminastrator o r organizing here are the steps to control everything as adminastrator:**
1st open an account on supabase

2 create a new proyect called mundialscore

3rd create 2 databses called ( "predicciones" and " resultados_oficiales " )

4th for " resultados_oficiales " cretae a new column called " resultados " in the format of jsonb

5th for "predicciones" create  the next columns ( fecha  in format timestampz, datos_juego in format jsonb and usuario in format text (string))

6th get the API url and key and paste it on logica.js file in the first 2 VAR 

7th open admin html in your pc and update the result of the matches so the software can make the calcutions  to update the leadboards


Created by: Alejandro montoya
Version: 1.0 (December 2025)

Note: The specific team groupings are not final yet as the draw hasn't happened. For now, we use A1, A2, etc. Only Mexico, Canada, and the USA have fixed spots, the friday  5  of december this code will be updated
