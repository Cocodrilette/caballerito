// ESCRIBIR SPRITES: convierte un dibujo en el código de src/sprites/*.js
// (y al revés, rescata los comentarios del archivo para no perderlos).
// Lo usan el taller (para mostrar el código) y el servidor (para guardar).

export const NOMBRE_ARCHIVO = /^[a-z][a-z0-9_]{0,39}$/;
export const NOMBRE_ANIMACION = /^[a-z_][a-z0-9_]{0,29}$/;
export const COLOR = /^#[0-9a-fA-F]{6}$/;

// Una letra de la paleta: un solo carácter que se pueda escribir en una fila.
export function letraValida(letra) {
  return typeof letra === "string" && [...letra].length === 1 && !/[\s"'`\\]/.test(letra);
}

// En JavaScript, "W" se puede escribir sin comillas, pero "." no.
function llave(letra) {
  return /^[A-Za-z_$]$/.test(letra) ? letra : JSON.stringify(letra);
}

// --- Leer los comentarios de un archivo que ya existe ---

export function leerComentarios(fuente) {
  const lineas = fuente.split(/\r?\n/);

  // Las primeras líneas con // son la cabecera del dibujo.
  const cabecera = [];
  for (const linea of lineas) {
    if (!linea.trim().startsWith("//")) break;
    cabecera.push(linea.trim());
  }

  const paleta = {}; // letra → { comentario, hueco }
  const animaciones = {}; // nombre → { comentario, etiquetas: [] }
  let enPaleta = false;
  let actual = null;
  let notas = [];

  for (const linea of lineas) {
    if (/^\s*paleta:\s*\{/.test(linea)) enPaleta = true;
    else if (enPaleta && /^\s*\},?\s*$/.test(linea)) enPaleta = false;
    else if (enPaleta) {
      const m = linea.match(/^\s*(?:"(.)"|'(.)'|(\S)):\s*(?:"#[0-9a-fA-F]+"|null),?(\s*)(?:\/\/\s?(.*))?$/);
      if (m && m[5] !== undefined) {
        paleta[m[1] ?? m[2] ?? m[3]] = { comentario: m[5].trim(), hueco: m[4] || " " };
      }
      continue;
    }

    const anim = linea.match(/^\s*(\w+):\s*\{.*cuadros:\s*\[/);
    if (anim) {
      actual = { comentario: notas.join("\n"), etiquetas: [] };
      animaciones[anim[1]] = actual;
      notas = [];
      continue;
    }
    const cuadro = linea.match(/^\s*\[\s*\/\/\s?(.*)$/);
    if (cuadro && actual) {
      actual.etiquetas.push(cuadro[1].trim());
      continue;
    }
    const nota = linea.match(/^\s*\/\/\s?(.*)$/);
    if (nota && actual !== undefined) notas.push(nota[1]);
    else notas = [];
  }
  return { cabecera: cabecera.join("\n"), paleta, animaciones };
}

// --- Revisar un dibujo antes de guardarlo ---
// Devuelve una lista de problemas (vacía = todo bien).

export function revisarDibujo(dibujo) {
  const problemas = [];
  const colores = { ".": null, ...dibujo.comun };
  for (const propio of dibujo.propios) {
    if (!letraValida(propio.letra)) problemas.push(`La letra "${propio.letra}" no sirve como color.`);
    if (!COLOR.test(propio.color)) problemas.push(`El color de "${propio.letra}" no es válido.`);
    colores[propio.letra] = propio.color;
  }
  if (!NOMBRE_ARCHIVO.test(dibujo.nombre)) problemas.push(`El nombre "${dibujo.nombre}" no es válido.`);
  if (dibujo.animaciones.length === 0) problemas.push("El dibujo necesita al menos una animación.");

  const vistos = new Set();
  let ancho = null;
  let alto = null;
  for (const anim of dibujo.animaciones) {
    if (!NOMBRE_ANIMACION.test(anim.nombre)) problemas.push(`La animación "${anim.nombre}" tiene un nombre raro.`);
    if (vistos.has(anim.nombre)) problemas.push(`Hay dos animaciones llamadas "${anim.nombre}".`);
    vistos.add(anim.nombre);
    if (anim.cuadros.length === 0) problemas.push(`La animación "${anim.nombre}" no tiene cuadros.`);
    if (!(anim.velocidad > 0)) problemas.push(`La velocidad de "${anim.nombre}" debe ser mayor que 0.`);
    anim.cuadros.forEach((cuadro, c) => {
      alto ??= cuadro.filas.length;
      if (cuadro.filas.length !== alto) problemas.push(`"${anim.nombre}", cuadro ${c + 1}: tiene otro alto.`);
      cuadro.filas.forEach((fila, f) => {
        ancho ??= [...fila].length;
        if ([...fila].length !== ancho) problemas.push(`"${anim.nombre}", cuadro ${c + 1}, fila ${f + 1}: tiene otro ancho.`);
        for (const letra of fila) {
          if (!(letra in colores)) problemas.push(`"${anim.nombre}", cuadro ${c + 1}: la letra "${letra}" no tiene color.`);
        }
      });
    });
  }
  return [...new Set(problemas)];
}

// --- Escribir el código del archivo ---

export function escribirSprite(dibujo) {
  const cabecera = dibujo.cabecera?.trim() ||
    `// ${dibujo.nombre.toUpperCase()}: un dibujo nuevo.\n// Cada letra es un píxel. Mira los colores en paleta.js.`;
  const partes = [cabecera, 'import { PALETA } from "./paleta.js";', "", "export default {"];
  partes.push(`  nombre: ${JSON.stringify(dibujo.nombre)},`);

  if (dibujo.propios.length === 0) {
    partes.push("  paleta: PALETA,");
  } else {
    partes.push("  paleta: {", "    ...PALETA,");
    for (const { letra, color, comentario, hueco } of dibujo.propios) {
      const nota = comentario ? `${hueco || " "}// ${comentario}` : "";
      partes.push(`    ${llave(letra)}: ${JSON.stringify(color.toLowerCase())},${nota}`);
    }
    partes.push("  },");
  }

  partes.push("  animaciones: {");
  for (const anim of dibujo.animaciones) {
    for (const nota of (anim.comentario || "").split("\n").filter((l) => l.trim())) {
      partes.push(`    // ${nota.trim()}`);
    }
    partes.push(`    ${anim.nombre}: { velocidad: ${anim.velocidad}, repetir: ${anim.repetir}, cuadros: [`);
    anim.cuadros.forEach((cuadro, c) => {
      partes.push(`      [ // ${etiquetaNumerada(cuadro.etiqueta, c)}`);
      for (const fila of cuadro.filas) partes.push(`        ${JSON.stringify(fila)},`);
      partes.push("      ],");
    });
    partes.push("    ]},");
  }
  partes.push("  },", "};", "");
  return partes.join("\n");
}

// "cuadro 3: ojos cerrados" → si el cuadro se movió al lugar 1, "cuadro 1: ojos cerrados".
function etiquetaNumerada(etiqueta, indice) {
  const numero = `cuadro ${indice + 1}`;
  if (!etiqueta) return numero;
  const resto = etiqueta.match(/^cuadro\s+\d+(.*)$/i);
  return resto ? numero + resto[1] : `${numero}: ${etiqueta}`;
}

// Cambia colores de la paleta común sin tocar sus comentarios.
export function cambiarPaletaComun(fuente, cambios) {
  let nueva = fuente;
  for (const [letra, color] of Object.entries(cambios)) {
    if (!letraValida(letra) || !COLOR.test(color)) throw new Error(`Color no válido para "${letra}".`);
    const escapada = letra.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const patron = new RegExp(`^(\\s*(?:"${escapada}"|'${escapada}'|${escapada}):\\s*)"#[0-9a-fA-F]+"`, "m");
    if (!patron.test(nueva)) throw new Error(`No encontré la letra "${letra}" en paleta.js.`);
    nueva = nueva.replace(patron, `$1"${color.toLowerCase()}"`);
  }
  return nueva;
}
