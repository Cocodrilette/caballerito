// VALIDAR: revisamos el nivel antes de jugar o guardar,
// y le decimos al constructor qué falta, con cariño.
import { canciones } from "../audio/canciones.js";
import { infoDe } from "../leyenda.js";
import { emparejarFilas } from "./mapa.js";

// Devuelve { errores: [...], avisos: [...] }.
// Los errores no dejan jugar. Los avisos son solo consejos.
export function revisarNivel(nivel) {
  const errores = [];
  const avisos = [];
  const todo = nivel.mapa.join("");

  const inicios = todo.split("@").length - 1;
  if (inicios === 0) {
    errores.push("🧍 Falta el caballerito (@). Ponlo para saber dónde empieza el nivel.");
  } else if (inicios > 1) {
    errores.push("🧍 Hay más de un caballerito (@). Deja solo uno.");
  }

  if (!todo.includes(">")) {
    avisos.push("🚪 No hay puerta (>). Sin puerta no se puede salir del nivel.");
  }

  const raras = [...new Set(todo)].filter((letra) => !infoDe(letra));
  if (raras.length > 0) {
    avisos.push(`❓ No conozco estas letras: ${raras.map((l) => `"${l}"`).join(", ")}. El juego las ignorará.`);
  }
  return { errores, avisos };
}

// Arregla un nivel que viene de un archivo (.json subido o del juego).
// Devuelve { nivel, avisos } o lanza un error si no se puede leer.
export function arreglarNivel(datos) {
  const avisos = [];
  if (!datos || !Array.isArray(datos.mapa) || datos.mapa.length === 0) {
    throw new Error("Este archivo no tiene un mapa (una lista de filas).");
  }
  if (!datos.mapa.every((fila) => typeof fila === "string")) {
    throw new Error("Cada fila del mapa debe ser un texto entre comillas.");
  }
  const mapa = [...datos.mapa];
  const largos = new Set(mapa.map((fila) => fila.length));
  if (largos.size > 1) {
    emparejarFilas(mapa);
    avisos.push("📏 Las filas tenían distinto largo. Las emparejé agregando aire al final.");
  }
  const nivel = {
    nombre: typeof datos.nombre === "string" ? datos.nombre : "Nivel sin nombre",
    musica: canciones[datos.musica] ? datos.musica : "cueva",
    fondo: /^#[0-9a-f]{6}$/i.test(datos.fondo) ? datos.fondo : "#0b1020",
    siguiente: typeof datos.siguiente === "string" ? datos.siguiente : "",
    consejo: typeof datos.consejo === "string" ? datos.consejo : "",
    mapa,
  };
  return { nivel, avisos };
}

// El nivel tal como lo guarda el juego (sin "siguiente" ni "consejo" si están vacíos).
export function nivelParaGuardar(nivel) {
  const limpio = {
    nombre: nivel.nombre,
    musica: nivel.musica,
    fondo: nivel.fondo,
  };
  if (nivel.siguiente) limpio.siguiente = nivel.siguiente;
  if (nivel.consejo) limpio.consejo = nivel.consejo;
  limpio.mapa = nivel.mapa;
  return limpio;
}

// Nombre de archivo permitido: minúsculas, números, - y _
export function nombreDeArchivoValido(nombre) {
  return /^[a-z0-9_-]{1,40}$/.test(nombre);
}

// "Cueva de los Susurros" -> "cueva_de_los_susurros"
export function nombreParaArchivo(texto) {
  return (texto || "mi_nivel")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40) || "mi_nivel";
}
