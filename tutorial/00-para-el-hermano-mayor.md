# 0. Para el hermano mayor 👋

Este capítulo es para ti, el que acompaña. El resto del tutorial está escrito
para tu hermano, pero a los 7 años va a necesitar que le leas, que escribas
con él y, sobre todo, que celebres cada cosa que logre.

## Preparar el computador (una sola vez)

1. Instala **Node.js LTS** desde https://nodejs.org
2. Instala **Visual Studio Code** desde https://code.visualstudio.com
   - Extensión recomendada: *Spanish Language Pack* (menús en español).
   - Opcional: *Error Lens* (muestra los errores en la misma línea, muy visual).
3. Instala **Git** desde https://git-scm.com (en Windows, deja las opciones por defecto).
4. Clona o copia el proyecto y ábrelo en VS Code: *Archivo → Abrir carpeta*.
5. Abre la terminal de VS Code (**Ctrl + ñ** o *Ver → Terminal*) y ejecuta:
   ```bash
   npm install
   npm run dev
   ```
   En Windows también sirve el doble clic en `JUGAR.bat`.

Se abre el navegador en `http://localhost:5173`. Pon **VS Code a un lado y
el navegador al otro**: cuando guardes un archivo, el juego cambia solo en
un segundo. Ese momento de "¡lo cambié yo!" es la magia que buscamos.

## Cómo está organizado el proyecto

- **Datos que se editan sin programar:** `src/config.js` (perillas),
  `niveles/*.json`, `src/sprites/*.js` (dibujos en texto),
  `src/musica/*.js` (canciones en notas), `src/audio/efectos.js`.
- **Código del juego:** `src/jugador.js`, `src/habilidades/`, `src/enemigos/`,
  `src/niveles.js`, `src/objetos.js`, `src/escenas/`.
- **Herramientas:** `/editor.html` (niveles), `/herramientas/ver-sprites.html`,
  `/herramientas/probar-sonidos.html`.
- **Motor:** [Kaplay](https://kaplayjs.com) en modo global (`add`, `pos`,
  `sprite`, `onUpdate`... están disponibles en todos los archivos).
- **Reglas entre partes:** `CONTRATOS.md`.

## Consejos para acompañar

- **Sesiones cortas:** 20-30 minutos. Mejor que termine con ganas de más.
- **Él maneja el teclado.** Tú puedes dictar, señalar o escribir las partes
  largas, pero que él presione "guardar" y vea el resultado.
- **Primero jugar, después cambiar.** Antes de cada reto, que juegue y
  descubra qué quiere cambiar. La motivación nace de "quiero que Rei salte más".
- **Preguntar antes de explicar:** "¿Qué crees que pasa si pones 5000?".
  Que adivine, que pruebe y que compare.
- **Romper está bien.** Cuando algo falle, lean el error juntos (F12 → Console).
  Aprender a leer errores es la mitad de programar.
- **Commits como trofeos.** Cada reto logrado = un commit con un mensaje que
  él elija ("rei salta como canguro"). Mira el [capítulo 9](09-git.md).
- **Escribir en voz alta:** a los 7 años puede costarle escribir rápido.
  Los símbolos como `{ } [ ] ( ) ; =` son difíciles de encontrar en el teclado:
  hagan una "cazada de símbolos" y pégale una notita con dónde está cada uno.

## Orden sugerido

| Semana | Capítulos | Retos |
|---|---|---|
| 1 | 1, 2, 3 | 🥚 1-6 |
| 2 | 4 | 🐛 7-12 |
| 3 | 5, 6 | 🦗 13-18 |
| 4 | 7, 8, 9 | 🦗 19-20, 🦂 21-24 |
| Luego | Todos | 🦂 25-26, 🐉 27-30 (proyectos, pueden tomar varias sesiones) |

Las soluciones de cada reto están escondidas en `retos.md` (sección 🔓).
Úsalas como ayuda para ti, o para cuando él lleve un rato atascado.
