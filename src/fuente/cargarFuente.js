// Convierte las letras de letras.js en una fuente que Kaplay entiende.
// Dibujamos todas las letras en una hoja, una al lado de la otra.
import { LETRAS } from "./letras.js";

export const FUENTE = "pixel"; // el nombre de nuestra letra
export const TAMAÑO_LETRA = 9; // alto de cada renglón en píxeles

const ANCHO = 6; // 5 de letra + 1 de espacio
const POR_FILA = 16; // letras por fila en la hoja

export async function cargarFuente() {
  const letras = Object.keys(LETRAS);
  const hoja = document.createElement("canvas");
  hoja.width = POR_FILA * ANCHO;
  hoja.height = Math.ceil(letras.length / POR_FILA) * TAMAÑO_LETRA;
  const pincel = hoja.getContext("2d");
  pincel.fillStyle = "#ffffff";

  letras.forEach((letra, numero) => {
    const x = (numero % POR_FILA) * ANCHO;
    const y = Math.floor(numero / POR_FILA) * TAMAÑO_LETRA;
    const filas = LETRAS[letra].split(" ");
    filas.forEach((fila, dy) => {
      [...fila].forEach((punto, dx) => {
        if (punto === "#") pincel.fillRect(x + dx, y + dy, 1, 1);
      });
    });
  });

  await loadBitmapFont(FUENTE, hoja.toDataURL(), ANCHO, TAMAÑO_LETRA, { chars: letras.join("") });
}
