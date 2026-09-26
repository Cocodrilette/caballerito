// DIBUJAR SPRITES
// Los dibujos del juego están escritos con letras en src/sprites/.
// Aquí convertimos el primer cuadro de cada dibujo en una imagen.

import { infoDe } from "../leyenda.js";

// Vite nos trae todos los archivos de sprites de una vez.
const archivos = import.meta.glob("../sprites/*.js", { eager: true });

const sprites = {};
for (const ruta in archivos) {
  const datos = archivos[ruta].default;
  if (datos && datos.nombre) sprites[datos.nombre] = datos;
}

const guardadas = {}; // imágenes ya hechas, para no repetir trabajo

// Devuelve un <canvas> con el dibujo, o null si todavía no existe.
export function imagenDeSprite(nombre) {
  if (!nombre || !sprites[nombre]) return null;
  if (guardadas[nombre]) return guardadas[nombre];
  try {
    const datos = sprites[nombre];
    const primeraAnimacion = Object.values(datos.animaciones)[0];
    const cuadro = primeraAnimacion.cuadros[0];
    const alto = cuadro.length;
    const ancho = Math.max(...cuadro.map((fila) => fila.length));

    const lienzo = document.createElement("canvas");
    lienzo.width = ancho;
    lienzo.height = alto;
    const pincel = lienzo.getContext("2d");
    for (let y = 0; y < alto; y++) {
      for (let x = 0; x < cuadro[y].length; x++) {
        const color = datos.paleta[cuadro[y][x]];
        if (!color) continue; // null = transparente
        pincel.fillStyle = color;
        pincel.fillRect(x, y, 1, 1);
      }
    }
    guardadas[nombre] = lienzo;
    return lienzo;
  } catch (error) {
    console.warn("No pude dibujar el sprite", nombre, error);
    return null;
  }
}

// Dibuja una cosa del mapa (por su letra) dentro de una casilla.
// Si el sprite aún no existe, pinta un cuadrito de color con su letra.
export function dibujarCosa(pincel, letra, x, y, tam, nombreSprite) {
  const info = infoDe(letra);
  if (!info) {
    // Letra desconocida: un signo de pregunta rojo
    pincel.fillStyle = "#5a1a2a";
    pincel.fillRect(x, y, tam, tam);
    pincel.fillStyle = "#ff8a80";
    escribirLetra(pincel, "?", x, y, tam);
    return;
  }
  if (info.tipo === "vacio") return;

  const imagen = imagenDeSprite(nombreSprite || info.sprite);
  if (imagen) {
    const escala = tam / 16;
    const ancho = imagen.width * escala;
    const alto = imagen.height * escala;
    // Centrado a lo ancho. Si es alto (como la puerta), crece hacia arriba.
    const dx = x + (tam - ancho) / 2;
    const dy = alto > tam ? y + tam - alto : y + (tam - alto) / 2;
    pincel.drawImage(imagen, dx, dy, ancho, alto);
    return;
  }

  // Todavía no hay dibujo: cuadrito de color con la letra.
  const margen = tam * 0.08;
  pincel.fillStyle = info.color;
  pincel.fillRect(x + margen, y + margen, tam - margen * 2, tam - margen * 2);
  pincel.fillStyle = colorDeLetra(info.color);
  escribirLetra(pincel, letra, x, y, tam);
}

function escribirLetra(pincel, letra, x, y, tam) {
  pincel.font = `bold ${Math.round(tam * 0.7)}px monospace`;
  pincel.textAlign = "center";
  pincel.textBaseline = "middle";
  pincel.fillText(letra, x + tam / 2, y + tam / 2 + 1);
}

// Letra negra sobre colores claros, blanca sobre oscuros.
function colorDeLetra(fondo) {
  const r = parseInt(fondo.slice(1, 3), 16);
  const g = parseInt(fondo.slice(3, 5), 16);
  const b = parseInt(fondo.slice(5, 7), 16);
  return r * 0.3 + g * 0.6 + b * 0.1 > 140 ? "#0b1020" : "#ffffff";
}

// Un icono para los botones de la paleta (cabe en un cuadrado).
export function iconoDe(letra, tamano = 44) {
  const info = infoDe(letra);
  const lienzo = document.createElement("canvas");
  lienzo.width = tamano;
  lienzo.height = tamano;
  const pincel = lienzo.getContext("2d");
  pincel.imageSmoothingEnabled = false;
  const imagen = imagenDeSprite(info?.sprite);
  if (imagen) {
    const escala = Math.max(1, Math.floor(tamano / Math.max(imagen.width, imagen.height)));
    const ancho = imagen.width * escala;
    const alto = imagen.height * escala;
    pincel.drawImage(imagen, (tamano - ancho) / 2, (tamano - alto) / 2, ancho, alto);
  } else {
    dibujarCosa(pincel, letra, 0, 0, tamano);
  }
  return lienzo;
}

export function existeSprite(nombre) {
  return Boolean(sprites[nombre]);
}
