// EL MAPA
// Un mapa es una lista de filas. Cada fila es un texto, y cada
// letra del texto es un bloque del nivel. ¡Así de simple!

export const VACIO = " ";

// Un nivel nuevo: todo aire, con suelo en el borde y el caballerito.
export function crearNivelVacio(ancho = 30, alto = 16) {
  const mapa = [];
  for (let y = 0; y < alto; y++) {
    let fila = "";
    for (let x = 0; x < ancho; x++) {
      const esBorde = y === 0 || y === alto - 1 || x === 0 || x === ancho - 1;
      fila += esBorde ? "=" : VACIO;
    }
    mapa.push(fila);
  }
  // El caballerito aparece abajo a la izquierda, parado en el suelo.
  mapa[alto - 2] = ponerEnTexto(mapa[alto - 2], 2, "@");
  return {
    nombre: "Mi cueva nueva",
    musica: "cueva",
    fondo: "#0b1020",
    siguiente: "",
    consejo: "",
    mapa,
  };
}

export function anchoDe(mapa) {
  return mapa.length ? mapa[0].length : 0;
}

export function altoDe(mapa) {
  return mapa.length;
}

// Cambia una letra dentro de un texto.
function ponerEnTexto(texto, x, letra) {
  return texto.slice(0, x) + letra + texto.slice(x + 1);
}

export function letraEn(mapa, x, y) {
  if (y < 0 || y >= mapa.length) return null;
  if (x < 0 || x >= mapa[y].length) return null;
  return mapa[y][x];
}

// Pone una letra. Devuelve true si algo cambió.
export function ponerLetra(mapa, x, y, letra) {
  const actual = letraEn(mapa, x, y);
  if (actual === null || actual === letra) return false;
  // Solo puede haber un caballerito: si ponemos otro, borramos el viejo.
  if (letra === "@") quitarLetra(mapa, "@");
  mapa[y] = ponerEnTexto(mapa[y], x, letra);
  return true;
}

// Borra todas las veces que aparece una letra.
function quitarLetra(mapa, letra) {
  for (let y = 0; y < mapa.length; y++) {
    mapa[y] = mapa[y].split(letra).join(VACIO);
  }
}

// El bote de pintura: pinta todos los bloques iguales que se tocan.
export function rellenar(mapa, x, y, letra) {
  const vieja = letraEn(mapa, x, y);
  if (vieja === null || vieja === letra) return false;
  if (letra === "@") return ponerLetra(mapa, x, y, letra); // un solo @
  const filas = mapa.map((fila) => fila.split(""));
  const pendientes = [[x, y]];
  while (pendientes.length > 0) {
    const [px, py] = pendientes.pop();
    if (filas[py]?.[px] !== vieja) continue;
    filas[py][px] = letra;
    pendientes.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]);
  }
  for (let i = 0; i < filas.length; i++) mapa[i] = filas[i].join("");
  return true;
}

// Hace que todas las filas tengan el mismo largo (rellena con aire).
export function emparejarFilas(mapa) {
  const largo = Math.max(1, ...mapa.map((fila) => fila.length));
  for (let y = 0; y < mapa.length; y++) mapa[y] = mapa[y].padEnd(largo, VACIO);
  return mapa;
}

// --- Agrandar y achicar el mapa, sin perder lo dibujado ---

export function agregarFila(mapa, lado) {
  const nueva = VACIO.repeat(anchoDe(mapa));
  if (lado === "arriba") mapa.unshift(nueva);
  else mapa.push(nueva);
}

export function quitarFila(mapa, lado) {
  if (mapa.length <= 3) return; // un mapa muy chiquito no sirve
  if (lado === "arriba") mapa.shift();
  else mapa.pop();
}

export function agregarColumna(mapa, lado) {
  for (let y = 0; y < mapa.length; y++) {
    mapa[y] = lado === "izquierda" ? VACIO + mapa[y] : mapa[y] + VACIO;
  }
}

export function quitarColumna(mapa, lado) {
  if (anchoDe(mapa) <= 3) return;
  for (let y = 0; y < mapa.length; y++) {
    mapa[y] = lado === "izquierda" ? mapa[y].slice(1) : mapa[y].slice(0, -1);
  }
}
