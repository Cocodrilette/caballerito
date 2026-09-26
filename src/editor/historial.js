// HISTORIAL: para deshacer (Ctrl+Z) y rehacer (Ctrl+Y).
// Guardamos "fotos" del nivel antes de cada cambio.

const atras = []; // fotos del pasado
const adelante = []; // fotos que deshicimos
const MAXIMO = 150;

function foto(nivel) {
  return typeof nivel === "string" ? nivel : JSON.stringify(nivel);
}

// Llamar ANTES de cambiar el nivel.
export function guardarPaso(nivel) {
  atras.push(foto(nivel));
  if (atras.length > MAXIMO) atras.shift();
  adelante.length = 0;
}

// Devuelve el nivel de antes (o null si no hay).
export function deshacer(nivelActual) {
  if (atras.length === 0) return null;
  adelante.push(foto(nivelActual));
  return JSON.parse(atras.pop());
}

export function rehacer(nivelActual) {
  if (adelante.length === 0) return null;
  atras.push(foto(nivelActual));
  return JSON.parse(adelante.pop());
}

export function puedoDeshacer() {
  return atras.length > 0;
}

export function puedoRehacer() {
  return adelante.length > 0;
}
