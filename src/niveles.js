// LOS NIVELES
// Lee los mapas de la carpeta niveles/ y los convierte en cosas del juego.
// Cada letra del mapa es un objeto (mira src/leyenda.js).
import { TAMAÑO_BLOQUE } from "./config.js";
import { infoDe } from "./leyenda.js";
import * as objetos from "./objetos.js";
import { crearGusano } from "./enemigos/gusano.js";
import { crearMosquito } from "./enemigos/mosquito.js";
import { crearJefe } from "./enemigos/jefe.js";

// Vite junta todos los archivos .json de la carpeta niveles/.
const archivos = import.meta.glob("../niveles/*.json", { eager: true, import: "default" });

const NIVELES = {};
for (const ruta in archivos) {
  const nombre = ruta.split("/").pop().replace(".json", "");
  NIVELES[nombre] = archivos[ruta];
}

// El orden de los niveles está en niveles/indice.json
export const ORDEN_NIVELES = NIVELES.indice ? NIVELES.indice.niveles : ["nivel1"];

export function buscarNivel(nombre) {
  return NIVELES[nombre];
}

// ¿Qué nivel cargamos al abrir el juego?
// ?prueba=1  -> el nivel que mandó el editor
// ?nivel=x   -> el nivel x
export function nivelInicial() {
  const pedido = new URLSearchParams(location.search);

  if (pedido.get("prueba")) {
    try {
      const datos = JSON.parse(localStorage.getItem("editor:nivelPrueba"));
      if (datos && datos.mapa) return { nombre: "prueba", datos, saltarTitulo: true };
    } catch (error) {
      console.warn("No pude leer el nivel de prueba del editor", error);
    }
  }

  const nombre = pedido.get("nivel");
  if (nombre && buscarNivel(nombre)) {
    return { nombre, datos: buscarNivel(nombre), saltarTitulo: true };
  }

  const primero = ORDEN_NIVELES[0];
  return { nombre: primero, datos: buscarNivel(primero), saltarTitulo: false };
}

// Construye el nivel dentro de "mundo".
// Devuelve un "nivel" con información útil para los demás.
export function construirNivel(datos, mundo) {
  const mapa = datos.mapa;
  const B = TAMAÑO_BLOQUE;

  const letra = (col, fila) => (mapa[fila] ? mapa[fila][col] || " " : " ");

  const nivel = {
    mundo,
    ancho: mapa[0].length * B,
    alto: mapa.length * B,
    inicio: vec2(2 * B, 2 * B),
    jugador: null, // se llena cuando aparece el jugador
    tieneJefe: false,
    // ¿Hay roca en esta casilla? (los enemigos lo usan para no chocar)
    esRoca: (col, fila) => letra(col, fila) === "=",
    // ¿Se puede pisar esta casilla?
    esPiso: (col, fila) => letra(col, fila) === "=" || letra(col, fila) === "-",
    // ¿Hay pinchos aquí?
    esPinchos: (col, fila) => letra(col, fila) === "^",
  };

  // Recorremos el mapa letra por letra.
  for (let fila = 0; fila < mapa.length; fila++) {
    for (let col = 0; col < mapa[fila].length; col++) {
      const simbolo = mapa[fila][col];
      const x = col * B;
      const y = fila * B;

      if (!infoDe(simbolo)) {
        console.warn(`La letra "${simbolo}" no está en la leyenda`);
        continue;
      }

      if (simbolo === "=") {
        // Si no hay roca encima, usamos la roca con borde bonito.
        const dibujo = letra(col, fila - 1) === "=" ? "suelo" : "suelo_borde";
        mundo.add([sprite(dibujo), pos(x, y)]);
      } else if (simbolo === "-") {
        mundo.add([sprite("plataforma"), pos(x, y)]);
      } else if (simbolo === "^") {
        objetos.crearPinchos(mundo, x, y);
      } else if (simbolo === "@") {
        nivel.inicio = vec2(x + B / 2, y + B);
      } else if (simbolo === "B") {
        objetos.crearBanca(mundo, x, y);
      } else if (simbolo === "$") {
        objetos.crearMoneda(mundo, x + B / 2, y + B / 2);
      } else if (simbolo === ">") {
        // Una puerta mide 2 casillas: solo la creamos en la de abajo.
        if (letra(col, fila + 1) !== ">") objetos.crearPuerta(mundo, x, y);
      } else if (simbolo === "g") {
        crearGusano(nivel, x + B / 2, y + B);
      } else if (simbolo === "m") {
        crearMosquito(nivel, x + B / 2, y + B / 2);
      } else if (simbolo === "J") {
        crearJefe(nivel, x + B / 2, y + B);
        nivel.tieneJefe = true;
      } else if (simbolo === "*" || simbolo === "h") {
        objetos.crearDecoracion(mundo, simbolo, x, y);
      }
    }
  }

  // Las paredes invisibles que de verdad chocan.
  crearParedes(mundo, mapa, "=", "solido", B);
  crearParedes(mundo, mapa, "-", "plataforma", 10);

  return nivel;
}

// Truco: en vez de un bloque que choca por cada letra, juntamos las
// letras vecinas en rectángulos grandes. Así el caballerito no se
// tropieza con las uniones entre bloques.
function crearParedes(mundo, mapa, simbolo, etiqueta, altoBloque) {
  const B = TAMAÑO_BLOQUE;
  const usado = mapa.map((fila) => [...fila].map(() => false));
  const libre = (col, fila) => mapa[fila] && mapa[fila][col] === simbolo && !usado[fila][col];

  for (let fila = 0; fila < mapa.length; fila++) {
    for (let col = 0; col < mapa[fila].length; col++) {
      if (!libre(col, fila)) continue;

      // 1. ¿Cuántas letras iguales hay hacia la derecha?
      let ancho = 1;
      while (libre(col + ancho, fila)) ancho++;

      // 2. ¿Cuántas filas de abajo tienen la misma tira? (solo para roca)
      let alto = 1;
      const filaCompleta = (f) => [...Array(ancho).keys()].every((i) => libre(col + i, f));
      while (simbolo === "=" && filaCompleta(fila + alto)) alto++;

      for (let f = fila; f < fila + alto; f++) {
        for (let i = 0; i < ancho; i++) usado[f][col + i] = true;
      }

      const altoTotal = (alto - 1) * B + altoBloque;
      mundo.add([
        pos(col * B, fila * B),
        area({ shape: new Rect(vec2(0), ancho * B, altoTotal) }),
        body({ isStatic: true }),
        etiqueta,
      ]);
    }
  }
}
