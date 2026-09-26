// LA PARTIDA GUARDADA
// El navegador tiene una "cajita" llamada localStorage donde podemos
// guardar texto. Ahí anotamos por dónde vas, para seguir otro día.
import { GUARDAR_PARTIDA } from "./config.js";

const CLAVE = "caballerito:partida"; // el nombre de nuestra cajita
const VERSION = 1; // si algún día cambiamos qué se guarda, subimos este número

// Guarda: nivel, banca (en casillas, o null = inicio), geo, vidasMaximas, personaje.
export function guardarPartida(datos) {
  if (!GUARDAR_PARTIDA) return;
  const partida = { version: VERSION, ...datos, fecha: new Date().toISOString() };
  try {
    localStorage.setItem(CLAVE, JSON.stringify(partida));
  } catch (error) {
    console.warn("No pude guardar la partida", error);
  }
}

// Devuelve la partida guardada, o null si no hay ninguna.
export function cargarPartida() {
  if (!GUARDAR_PARTIDA) return null;
  try {
    const partida = JSON.parse(localStorage.getItem(CLAVE));
    if (partida && partida.version === VERSION) return partida;
  } catch (error) {
    console.warn("No pude leer la partida guardada", error);
  }
  return null;
}

// Olvida la partida guardada.
export function borrarPartida() {
  try {
    localStorage.removeItem(CLAVE);
  } catch (error) {
    // Si no se puede borrar, no pasa nada.
  }
}
