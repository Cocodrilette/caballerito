// ESTADO DEL EDITOR
// Aquí vive todo lo que el editor recuerda: el nivel que dibujamos,
// qué herramienta tenemos en la mano y qué tan cerca miramos.

export const estado = {
  nivel: null, // { nombre, musica, fondo, siguiente, mapa: ["====", ...] }
  archivo: "", // nombre del archivo en niveles/ (sin .json), si ya tiene
  letra: "=", // la letra que vamos a pintar (mira src/leyenda.js)
  herramienta: "lapiz", // "lapiz", "rellenar" o "borrador"
  zoom: 2, // 1 = tamaño real, 2 = el doble de grande...
  verCuadricula: true,
};

// Cuando algo cambia, avisamos a todos los que quieren saberlo.
const oyentes = [];

export function alCambiar(funcion) {
  oyentes.push(funcion);
}

// motivo: "mapa", "datos", "herramienta", "zoom" o "todo"
export function avisarCambio(motivo) {
  for (const funcion of oyentes) funcion(motivo);
}
