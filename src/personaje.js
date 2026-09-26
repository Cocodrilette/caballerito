// LOS PERSONAJES QUE PUEDES ELEGIR
// Cada uno usa su propio dibujo (sprite), pero se mueven igual.
import { PERSONAJE } from "./config.js";

export const PERSONAJES = [
  { sprite: "caballero", nombre: "CABALLERITO", victoria: "El caballerito salvó la cueva." },
  { sprite: "rei", nombre: "REI", victoria: "Rei salvó la cueva." },
];

const GUARDADO = "caballerito:personaje"; // dónde se recuerda tu elección

// Solo los personajes cuyo dibujo ya existe.
export function personajesDisponibles() {
  return PERSONAJES.filter((p) => getSprite(p.sprite));
}

// El personaje con el que vas a jugar.
export function personajeElegido() {
  let nombre = PERSONAJE;
  try {
    nombre = localStorage.getItem(GUARDADO) || PERSONAJE;
  } catch (error) {
    // Si el navegador no deja guardar, usamos el de config.js
  }
  const disponibles = personajesDisponibles();
  return disponibles.find((p) => p.sprite === nombre) || disponibles[0];
}

export function guardarPersonaje(personaje) {
  try {
    localStorage.setItem(GUARDADO, personaje.sprite);
  } catch (error) {
    // No pasa nada si no se puede guardar.
  }
}
