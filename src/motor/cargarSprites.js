// CARGADOR DE SPRITES
// Lee los dibujos en texto de src/sprites/, los pinta en un lienzo
// y se los entrega a Kaplay con loadSprite().

// Vite trae todos los archivos de la carpeta sprites de una vez.
const archivos = import.meta.glob("../sprites/*.js", { eager: true });

// Un error amable que dice dónde está el problema.
function problema(archivo, mensaje) {
  return new Error(`Problema en el dibujo "src/sprites/${archivo}": ${mensaje}`);
}

// Revisa que el dibujo esté bien hecho: mismo tamaño en todas las filas
// y cuadros, y que cada letra tenga un color en la paleta.
function revisar(archivo, sprite) {
  if (!sprite || !sprite.animaciones) {
    throw problema(archivo, "falta 'export default { nombre, paleta, animaciones }'.");
  }
  if (!sprite.paleta) throw problema(archivo, "falta la paleta de colores.");

  let ancho = null;
  let alto = null;

  for (const [animacion, datos] of Object.entries(sprite.animaciones)) {
    if (!Array.isArray(datos.cuadros) || datos.cuadros.length === 0) {
      throw problema(archivo, `la animación "${animacion}" no tiene cuadros.`);
    }
    datos.cuadros.forEach((cuadro, c) => {
      const donde = `animación "${animacion}", cuadro ${c + 1}`;
      if (alto === null) alto = cuadro.length;
      if (cuadro.length !== alto) {
        throw problema(archivo, `${donde} tiene ${cuadro.length} filas, pero debe tener ${alto}.`);
      }
      cuadro.forEach((fila, f) => {
        if (ancho === null) ancho = fila.length;
        if (fila.length !== ancho) {
          throw problema(archivo,
            `${donde}, fila ${f + 1} ("${fila}") tiene ${fila.length} letras, pero debe tener ${ancho}.`);
        }
        for (const letra of fila) {
          if (!(letra in sprite.paleta)) {
            throw problema(archivo,
              `${donde}, fila ${f + 1}: la letra "${letra}" no tiene color en la paleta.`);
          }
        }
      });
    });
  }
  return { ancho, alto };
}

// Pinta todos los cuadros, uno al lado del otro, en un lienzo.
function pintar(sprite, ancho, alto) {
  const cuadros = Object.values(sprite.animaciones).flatMap((a) => a.cuadros);
  const lienzo = document.createElement("canvas");
  lienzo.width = ancho * cuadros.length;
  lienzo.height = alto;
  const pincel = lienzo.getContext("2d");

  cuadros.forEach((cuadro, c) => {
    cuadro.forEach((fila, y) => {
      [...fila].forEach((letra, x) => {
        const color = sprite.paleta[letra];
        if (!color) return; // null = transparente
        pincel.fillStyle = color;
        pincel.fillRect(c * ancho + x, y, 1, 1);
      });
    });
  });
  return { lienzo, total: cuadros.length };
}

// Convierte las animaciones al formato de Kaplay: { from, to, loop, speed }.
function animacionesKaplay(sprite) {
  const anims = {};
  let desde = 0;
  for (const [nombre, datos] of Object.entries(sprite.animaciones)) {
    const cantidad = datos.cuadros.length;
    anims[nombre] = {
      from: desde,
      to: desde + cantidad - 1,
      loop: datos.repetir ?? true,
      speed: datos.velocidad ?? 6,
    };
    desde += cantidad;
  }
  return anims;
}

// Revisa y pinta todos los sprites (lo usa también la galería).
export function prepararSprites() {
  const lista = [];
  for (const [ruta, modulo] of Object.entries(archivos)) {
    const archivo = ruta.split("/").pop();
    if (archivo === "paleta.js") continue; // la paleta no es un dibujo
    const sprite = modulo.default;
    const { ancho, alto } = revisar(archivo, sprite);
    const { lienzo, total } = pintar(sprite, ancho, alto);
    lista.push({
      nombre: sprite.nombre ?? archivo.replace(".js", ""),
      archivo, sprite, ancho, alto, lienzo, total,
      anims: animacionesKaplay(sprite),
    });
  }
  return lista;
}

// Carga todos los sprites en Kaplay. La primera animación es la de siempre.
export async function cargarSprites() {
  const esperas = prepararSprites().map((s) =>
    loadSprite(s.nombre, s.lienzo.toDataURL(), { sliceX: s.total, anims: s.anims })
  );
  await Promise.all(esperas);
}
