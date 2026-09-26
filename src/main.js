// ¡AQUÍ EMPIEZA TODO!
// Este archivo prende el motor de juegos (Kaplay), carga los dibujos
// y decide qué pantalla se muestra primero.
import kaplay from "kaplay";
import { ANCHO_PANTALLA, ALTO_PANTALLA, BOTONES } from "./config.js";
import { cargarSprites } from "./motor/cargarSprites.js";
import { cargarFuente, FUENTE } from "./fuente/cargarFuente.js";
import { escenaTitulo } from "./escenas/titulo.js";
import { escenaJuego } from "./escenas/juego.js";
import { escenaVictoria } from "./escenas/victoria.js";
import { nivelInicial } from "./niveles.js";

kaplay({
  width: ANCHO_PANTALLA,
  height: ALTO_PANTALLA,
  letterbox: true, // la pantalla crece sin deformarse
  crisp: true, // píxeles bien nítidos
  texFilter: "nearest",
  background: "#05060c",
  font: FUENTE, // nuestra letra de píxeles (src/fuente/)
  buttons: BOTONES, // las teclas de config.js
});

// Cada escena es una "pantalla" del juego.
scene("titulo", escenaTitulo);
scene("juego", escenaJuego);
scene("victoria", escenaVictoria);

// Primero cargamos los dibujos y la letra, luego mostramos el título.
await Promise.all([cargarSprites(), cargarFuente()]);

// Truco para probar: index.html?nivel=jefe o ?prueba=1 salta directo al juego.
const inicio = nivelInicial();
if (inicio.saltarTitulo) {
  go("juego", { nombre: inicio.nombre, datos: inicio.datos }); // sin guardar partida
} else {
  go("titulo");
}
