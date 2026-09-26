// EL LIENZO: donde se ve y se dibuja el nivel.
// Clic izquierdo = pintar. Clic derecho = borrar.
// Rueda = acercar/alejar. Botón del medio o ESPACIO + arrastrar = moverse.

import { estado, avisarCambio } from "./estado.js";
import { anchoDe, altoDe, letraEn, ponerLetra, rellenar, VACIO } from "./mapa.js";
import { dibujarCosa, existeSprite } from "./dibujarSprite.js";
import { guardarPaso } from "./historial.js";
import { infoDe } from "../leyenda.js";

const BLOQUE = 16; // cada bloque mide 16 píxeles en el juego
export const ZOOMS = [0.5, 1, 1.5, 2, 3, 4, 5, 6];

let lienzo, pincel, zona, textoPosicion;
let casillaBajoMouse = null; // { x, y } o null
let trazo = null; // lo que estamos pintando ahora: { letra, antes, ultima }
let arrastre = null; // si nos estamos moviendo por el mapa
let espacioApretado = false;

export function prepararLienzo() {
  lienzo = document.getElementById("lienzo");
  pincel = lienzo.getContext("2d");
  zona = document.getElementById("zonaLienzo");
  textoPosicion = document.getElementById("posicion");

  lienzo.addEventListener("pointerdown", alApretar);
  window.addEventListener("pointermove", alMover);
  window.addEventListener("pointerup", alSoltar);
  lienzo.addEventListener("pointerleave", () => {
    casillaBajoMouse = null;
    textoPosicion.textContent = "";
    dibujar();
  });
  lienzo.addEventListener("contextmenu", (e) => e.preventDefault());
  zona.addEventListener("wheel", alGirarRueda, { passive: false });

  // La barra espaciadora sirve para agarrar el mapa y moverlo
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !escribiendo(e)) {
      e.preventDefault();
      espacioApretado = true;
      zona.classList.add("puedo-mover");
    }
  });
  window.addEventListener("keyup", (e) => {
    if (e.code === "Space") {
      espacioApretado = false;
      zona.classList.remove("puedo-mover");
    }
  });
}

// ¿Está el niño escribiendo en un campo de texto?
function escribiendo(e) {
  return ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName);
}

// --- Dibujar todo el nivel ---

export function dibujar() {
  const mapa = estado.nivel.mapa;
  const tam = BLOQUE * estado.zoom;
  const ancho = Math.round(anchoDe(mapa) * tam);
  const alto = Math.round(altoDe(mapa) * tam);
  if (lienzo.width !== ancho) lienzo.width = ancho;
  if (lienzo.height !== alto) lienzo.height = alto;
  pincel.imageSmoothingEnabled = false;

  // El fondo de la cueva
  pincel.fillStyle = estado.nivel.fondo;
  pincel.fillRect(0, 0, ancho, alto);

  // Cada letra del mapa, una por una
  for (let y = 0; y < mapa.length; y++) {
    for (let x = 0; x < mapa[y].length; x++) {
      const letra = mapa[y][x];
      if (letra === VACIO) continue;
      dibujarCosa(pincel, letra, x * tam, y * tam, tam, spriteParaCasilla(mapa, x, y, letra));
    }
  }

  if (estado.verCuadricula) dibujarCuadricula(ancho, alto, tam);
  dibujarFantasma(tam);
}

// El suelo que tiene aire encima usa el dibujo con borde (musgo).
function spriteParaCasilla(mapa, x, y, letra) {
  if (letra === "=" && letraEn(mapa, x, y - 1) !== "=" && existeSprite("suelo_borde")) {
    return "suelo_borde";
  }
  return null;
}

function dibujarCuadricula(ancho, alto, tam) {
  pincel.strokeStyle = "rgba(160, 190, 255, 0.12)";
  pincel.lineWidth = 1;
  pincel.beginPath();
  for (let x = 0; x <= ancho; x += tam) {
    pincel.moveTo(Math.round(x) + 0.5, 0);
    pincel.lineTo(Math.round(x) + 0.5, alto);
  }
  for (let y = 0; y <= alto; y += tam) {
    pincel.moveTo(0, Math.round(y) + 0.5);
    pincel.lineTo(ancho, Math.round(y) + 0.5);
  }
  pincel.stroke();
}

// Muestra qué vamos a pintar donde está el mouse.
function dibujarFantasma(tam) {
  if (!casillaBajoMouse || arrastre) return;
  const px = casillaBajoMouse.x * tam;
  const py = casillaBajoMouse.y * tam;
  if (estado.herramienta !== "borrador") {
    pincel.globalAlpha = 0.55;
    dibujarCosa(pincel, estado.letra, px, py, tam);
    pincel.globalAlpha = 1;
  }
  pincel.strokeStyle = estado.herramienta === "borrador" ? "#ff8a80" : "#e8c170";
  pincel.lineWidth = 2;
  pincel.strokeRect(px + 1, py + 1, tam - 2, tam - 2);
}

// --- El mouse ---

function casillaDesde(evento) {
  const caja = lienzo.getBoundingClientRect();
  const tam = BLOQUE * estado.zoom;
  const x = Math.floor((evento.clientX - caja.left) / tam);
  const y = Math.floor((evento.clientY - caja.top) / tam);
  if (letraEn(estado.nivel.mapa, x, y) === null) return null;
  return { x, y };
}

function alApretar(e) {
  e.preventDefault();
  // Botón del medio, o espacio apretado: mover el mapa
  if (e.button === 1 || espacioApretado) {
    arrastre = { x: e.clientX, y: e.clientY, izq: zona.scrollLeft, arriba: zona.scrollTop };
    zona.classList.add("moviendo");
    return;
  }
  const casilla = casillaDesde(e);
  if (!casilla) return;

  const borrar = e.button === 2 || estado.herramienta === "borrador";
  const letra = borrar ? VACIO : estado.letra;

  // El bote de pintura: un solo clic
  if (estado.herramienta === "rellenar" && !borrar) {
    const antes = JSON.stringify(estado.nivel);
    if (rellenar(estado.nivel.mapa, casilla.x, casilla.y, letra)) {
      guardarPaso(antes);
      avisarCambio("mapa");
    }
    return;
  }

  trazo = { letra, antes: JSON.stringify(estado.nivel), ultima: casilla, cambio: false };
  pintarEn(casilla);
}

function alMover(e) {
  if (arrastre) {
    zona.scrollLeft = arrastre.izq - (e.clientX - arrastre.x);
    zona.scrollTop = arrastre.arriba - (e.clientY - arrastre.y);
    return;
  }
  const casilla = e.target === lienzo ? casillaDesde(e) : null;
  const antes = casillaBajoMouse;
  casillaBajoMouse = casilla;
  if (casilla) mostrarPosicion(casilla);

  if (trazo && casilla) {
    // Pintamos una línea desde la última casilla, para no dejar huecos
    for (const punto of lineaEntre(trazo.ultima, casilla)) pintarEn(punto);
    trazo.ultima = casilla;
  } else if (antes?.x !== casilla?.x || antes?.y !== casilla?.y) {
    dibujar();
  }
}

function alSoltar() {
  if (arrastre) {
    arrastre = null;
    zona.classList.remove("moviendo");
  }
  if (trazo) {
    const cambio = trazo.cambio;
    if (cambio) guardarPaso(trazo.antes);
    trazo = null;
    if (cambio) avisarCambio("mapa"); // para encender el botón Deshacer
  }
}

function pintarEn(casilla) {
  if (ponerLetra(estado.nivel.mapa, casilla.x, casilla.y, trazo.letra)) {
    trazo.cambio = true;
    avisarCambio("mapa");
  }
}

function mostrarPosicion({ x, y }) {
  const letra = letraEn(estado.nivel.mapa, x, y);
  const info = infoDe(letra);
  const que = info ? `${info.nombre}` : `letra "${letra}"`;
  textoPosicion.textContent = `Columna ${x}, fila ${y} · ${que}`;
}

// Todas las casillas en línea recta entre dos puntos.
function lineaEntre(a, b) {
  const puntos = [];
  const pasos = Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y), 1);
  for (let i = 1; i <= pasos; i++) {
    puntos.push({
      x: Math.round(a.x + ((b.x - a.x) * i) / pasos),
      y: Math.round(a.y + ((b.y - a.y) * i) / pasos),
    });
  }
  return puntos;
}

// --- Acercar y alejar ---

function alGirarRueda(e) {
  e.preventDefault();
  cambiarZoom(e.deltaY < 0 ? +1 : -1, e);
}

// direccion: +1 acerca, -1 aleja. Mantiene quieto el punto bajo el mouse.
export function cambiarZoom(direccion, eventoMouse) {
  const indice = ZOOMS.indexOf(estado.zoom);
  const nuevo = ZOOMS[Math.min(ZOOMS.length - 1, Math.max(0, indice + direccion))];
  if (nuevo === estado.zoom) return;

  const caja = zona.getBoundingClientRect();
  const mx = eventoMouse ? eventoMouse.clientX - caja.left : zona.clientWidth / 2;
  const my = eventoMouse ? eventoMouse.clientY - caja.top : zona.clientHeight / 2;
  const mundoX = (zona.scrollLeft + mx - lienzo.offsetLeft) / estado.zoom;
  const mundoY = (zona.scrollTop + my - lienzo.offsetTop) / estado.zoom;

  estado.zoom = nuevo;
  avisarCambio("zoom");

  zona.scrollLeft = mundoX * nuevo + lienzo.offsetLeft - mx;
  zona.scrollTop = mundoY * nuevo + lienzo.offsetTop - my;
}

// Elige el zoom más grande con el que todo el mapa cabe en la pantalla.
export function ajustarZoomALaPantalla() {
  const mapa = estado.nivel.mapa;
  const espacioAncho = zona.clientWidth - 60;
  const espacioAlto = zona.clientHeight - 60;
  let elegido = 1;
  for (const z of ZOOMS) {
    if (z >= 1 && anchoDe(mapa) * BLOQUE * z <= espacioAncho && altoDe(mapa) * BLOQUE * z <= espacioAlto) elegido = z;
  }
  estado.zoom = elegido;
  avisarCambio("zoom");
}
