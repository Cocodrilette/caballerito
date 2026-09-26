// EDITOR DE NIVELES DE CABALLERITO
// Este archivo junta todas las piezas del editor y conecta los botones.

import { estado, alCambiar, avisarCambio } from "./estado.js";
import {
  crearNivelVacio, anchoDe, altoDe,
  agregarFila, quitarFila, agregarColumna, quitarColumna,
} from "./mapa.js";
import * as historial from "./historial.js";
import { prepararLienzo, dibujar, cambiarZoom, ajustarZoomALaPantalla } from "./lienzo.js";
import { prepararPaleta, marcarElegidos, elegirHerramienta } from "./paleta.js";
import { prepararTexto, mostrarTexto } from "./texto.js";
import * as archivos from "./archivos.js";
import { revisarNivel, nombreDeArchivoValido, nombreParaArchivo } from "./validar.js";
import { avisar, preguntar, pedirTexto } from "./mensajes.js";

const $ = (id) => document.getElementById(id);

// ---------- Empezar ----------

const recuperado = archivos.recuperarTrabajo();
if (recuperado) {
  estado.nivel = recuperado.nivel;
  estado.archivo = recuperado.archivo;
} else {
  estado.nivel = crearNivelVacio();
}

prepararLienzo();
prepararPaleta();
prepararTexto();
prepararBotones();
prepararCampos();
prepararTeclado();

// Cada vez que algo cambia, actualizamos lo que se ve y guardamos.
let esperaGuardar = null;
alCambiar((motivo) => {
  if (motivo === "herramienta") {
    marcarElegidos();
    dibujar();
    return;
  }
  dibujar();
  mostrarTexto();
  if (motivo !== "zoom") {
    mostrarCampos();
    clearTimeout(esperaGuardar);
    esperaGuardar = setTimeout(() => archivos.autoguardar(estado.nivel, estado.archivo), 300);
  }
  $("textoZoom").textContent = `${Math.round(estado.zoom * 100)}%`;
  $("botonDeshacer").disabled = !historial.puedoDeshacer();
  $("botonRehacer").disabled = !historial.puedoRehacer();
});

avisarCambio("todo");
ajustarZoomALaPantalla();
if (recuperado) avisar("👋 ¡Hola de nuevo! Aquí está tu nivel como lo dejaste.");

// ---------- Cambiar el nivel entero (nuevo, abrir, deshacer) ----------

function ponerNivel(nivel, archivo) {
  historial.guardarPaso(estado.nivel); // así se puede deshacer
  estado.nivel = nivel;
  if (archivo !== undefined) estado.archivo = archivo;
  avisarCambio("todo");
  ajustarZoomALaPantalla();
}

// Hacemos un cambio con "foto" antes, para poder deshacerlo.
function cambiarConHistorial(cambio) {
  historial.guardarPaso(estado.nivel);
  cambio();
  avisarCambio("mapa");
}

function deshacer() {
  const anterior = historial.deshacer(estado.nivel);
  if (anterior) {
    estado.nivel = anterior;
    avisarCambio("todo");
  }
}

function rehacer() {
  const siguiente = historial.rehacer(estado.nivel);
  if (siguiente) {
    estado.nivel = siguiente;
    avisarCambio("todo");
  }
}

// ---------- Revisar antes de jugar o guardar ----------

// Devuelve true si podemos seguir.
async function revisarAntes(accion) {
  const { errores, avisos } = revisarNivel(estado.nivel);
  if (errores.length > 0) {
    await preguntar("¡Espera un poquito! 🤔", [...errores, ...avisos], [
      { texto: "Voy a arreglarlo", valor: true, principal: true },
    ]);
    return false;
  }
  if (avisos.length > 0) {
    const seguir = await preguntar("Un consejito 💡", avisos, [
      { texto: "Mejor lo arreglo", valor: false },
      { texto: `${accion} igual`, valor: true, principal: true },
    ]);
    return seguir === true;
  }
  return true;
}

// ---------- Botones ----------

function prepararBotones() {
  // Deshacer / rehacer
  $("botonDeshacer").addEventListener("click", deshacer);
  $("botonRehacer").addEventListener("click", rehacer);

  // Zoom y cuadrícula
  $("botonAcercar").addEventListener("click", () => cambiarZoom(+1));
  $("botonAlejar").addEventListener("click", () => cambiarZoom(-1));
  $("botonCuadricula").addEventListener("click", () => {
    estado.verCuadricula = !estado.verCuadricula;
    $("botonCuadricula").classList.toggle("apagado", !estado.verCuadricula);
    dibujar();
  });

  // Pestañas: dibujar o ver como texto
  for (const pestana of document.querySelectorAll(".pestana")) {
    pestana.addEventListener("click", () => cambiarVista(pestana.dataset.vista));
  }

  // ¡Jugar!
  $("botonJugar").addEventListener("click", async () => {
    if (!(await revisarAntes("Jugar"))) return;
    archivos.probarNivel(estado.nivel);
    avisar("🎮 ¡Abriendo el juego con tu nivel!");
  });

  // Nuevo
  $("botonNuevo").addEventListener("click", async () => {
    const ok = await preguntar("📄 ¿Empezar un nivel nuevo?", "Si te arrepientes, puedes volver con Deshacer.", [
      { texto: "No", valor: false },
      { texto: "¡Sí, uno nuevo!", valor: true, principal: true },
    ]);
    if (!ok) return;
    ponerNivel(crearNivelVacio(), "");
    avisar("✨ ¡Nivel nuevo listo para dibujar!");
  });

  // Abrir un nivel del juego
  $("botonAbrir").addEventListener("click", abrirDelJuego);

  // Descargar
  $("botonDescargar").addEventListener("click", () => {
    const nombre = estado.archivo || nombreParaArchivo(estado.nivel.nombre);
    archivos.descargar(estado.nivel, nombre);
    avisar(`⬇️ Descargado: ${nombre}.json`);
  });

  // Subir
  $("botonSubir").addEventListener("click", () => $("entradaArchivo").click());
  $("entradaArchivo").addEventListener("change", async (e) => {
    const archivo = e.target.files[0];
    e.target.value = "";
    if (!archivo) return;
    try {
      const { nivel, avisos } = await archivos.leerArchivoSubido(archivo);
      ponerNivel(nivel, archivo.name.replace(/\.json$/i, "").toLowerCase().replace(/[^a-z0-9_-]/g, "_"));
      avisar(`⬆️ ¡Nivel "${nivel.nombre}" cargado!`);
      for (const aviso of avisos) avisar(aviso, "ojo");
    } catch (error) {
      await preguntar("😕 No pude abrir ese archivo", error.message, [{ texto: "Entendido", valor: true, principal: true }]);
    }
  });

  // Guardar en el juego
  $("botonGuardar").addEventListener("click", guardarEnElJuego);

  // Tamaño del mapa
  const cambios = {
    masAncho: () => agregarColumna(estado.nivel.mapa, "derecha"),
    menosAncho: () => quitarColumna(estado.nivel.mapa, "derecha"),
    masAlto: () => agregarFila(estado.nivel.mapa, "arriba"),
    menosAlto: () => quitarFila(estado.nivel.mapa, "arriba"),
    masIzquierda: () => agregarColumna(estado.nivel.mapa, "izquierda"),
    menosIzquierda: () => quitarColumna(estado.nivel.mapa, "izquierda"),
    masAbajo: () => agregarFila(estado.nivel.mapa, "abajo"),
    menosAbajo: () => quitarFila(estado.nivel.mapa, "abajo"),
  };
  for (const [id, cambio] of Object.entries(cambios)) {
    $(id).addEventListener("click", () => cambiarConHistorial(cambio));
  }
  // Escribir el ancho o el alto directamente
  $("campoAncho").addEventListener("change", () => ajustarTamano("ancho", Number($("campoAncho").value)));
  $("campoAlto").addEventListener("change", () => ajustarTamano("alto", Number($("campoAlto").value)));
}

function ajustarTamano(cual, deseado) {
  const mapa = estado.nivel.mapa;
  const limite = cual === "ancho" ? 300 : 100;
  deseado = Math.max(3, Math.min(limite, Math.round(deseado) || 3));
  cambiarConHistorial(() => {
    if (cual === "ancho") {
      while (anchoDe(mapa) < deseado) agregarColumna(mapa, "derecha");
      while (anchoDe(mapa) > deseado) quitarColumna(mapa, "derecha");
    } else {
      while (altoDe(mapa) < deseado) agregarFila(mapa, "arriba");
      while (altoDe(mapa) > deseado) quitarFila(mapa, "arriba");
    }
  });
}

function cambiarVista(vista) {
  for (const p of document.querySelectorAll(".pestana")) {
    p.classList.toggle("elegido", p.dataset.vista === vista);
  }
  $("vistaDibujo").classList.toggle("oculta", vista !== "dibujo");
  $("vistaTexto").classList.toggle("oculta", vista !== "texto");
  if (vista === "texto") mostrarTexto(true);
  else dibujar();
}

async function abrirDelJuego() {
  let lista = [];
  try {
    lista = await archivos.listaDeNiveles();
  } catch {
    lista = [];
  }
  if (lista.length === 0) {
    await preguntar("📂 Niveles del juego", "Todavía no encontré niveles en el juego (niveles/indice.json).", [
      { texto: "Está bien", valor: null, principal: true },
    ]);
    return;
  }
  const caja = document.createElement("div");
  caja.className = "lista-niveles";
  const dialogo = $("dialogo");
  for (const nombre of lista) {
    const boton = document.createElement("button");
    boton.className = "boton nivel-del-juego";
    boton.textContent = `🗺️ ${nombre}`;
    boton.addEventListener("click", async () => {
      dialogo.close();
      try {
        const { nivel, avisos } = await archivos.abrirNivelDelJuego(nombre);
        ponerNivel(nivel, nombre);
        avisar(`📂 ¡Abrí "${nivel.nombre}"!`);
        for (const aviso of avisos) avisar(aviso, "ojo");
      } catch (error) {
        avisar(`😕 ${error.message}`, "mal");
      }
    });
    caja.appendChild(boton);
  }
  await preguntar("📂 ¿Qué nivel quieres abrir?", caja, [{ texto: "Cancelar", valor: null }]);
}

async function guardarEnElJuego() {
  if (!(await revisarAntes("Guardar"))) return;
  const sugerido = estado.archivo || nombreParaArchivo(estado.nivel.nombre);
  let archivo = await pedirTexto(
    "💾 Guardar en el juego",
    "¿Cómo se llama el archivo? Usa letras minúsculas, números, - o _ (sin espacios).",
    sugerido,
  );
  if (archivo === null) return;
  archivo = archivo.toLowerCase();
  if (!nombreDeArchivoValido(archivo)) {
    await preguntar("✋ Ese nombre no sirve", `Prueba algo como "${nombreParaArchivo(archivo)}": solo minúsculas, números, - o _.`, [
      { texto: "Ok", valor: true, principal: true },
    ]);
    return;
  }
  if (archivo === "indice") {
    avisar("✋ Ese nombre está reservado. Elige otro.", "mal");
    return;
  }
  try {
    const resultado = await archivos.guardarEnElJuego(estado.nivel, archivo);
    if (resultado.ok) {
      estado.archivo = archivo;
      avisarCambio("datos"); // muestra el nombre del archivo y autoguarda
      avisar(resultado.nuevo ? `💾 ¡Guardado! "${archivo}" ya es parte del juego.` : `💾 ¡Guardado! Actualicé "${archivo}".`);
      return;
    }
    // No hay servidor de desarrollo (por ejemplo, el juego publicado)
    const bajar = await preguntar(
      "🙈 Aquí no puedo guardar en el juego",
      "Guardar en el juego solo funciona cuando el juego corre con «npm run dev». ¡Pero puedes descargar tu nivel y ponerlo en la carpeta niveles/!",
      [
        { texto: "Ahora no", valor: false },
        { texto: "⬇️ Descargar", valor: true, principal: true },
      ],
    );
    if (bajar) archivos.descargar(estado.nivel, archivo);
  } catch (error) {
    avisar(`😕 ${error.message}`, "mal");
  }
}

// ---------- Campos del nivel ----------

function prepararCampos() {
  $("campoNombre").addEventListener("input", (e) => cambiarDato("nombre", e.target.value));
  $("campoMusica").addEventListener("change", (e) => cambiarDato("musica", e.target.value));
  $("campoFondo").addEventListener("input", (e) => cambiarDato("fondo", e.target.value));
  $("campoSiguiente").addEventListener("input", (e) => cambiarDato("siguiente", e.target.value.trim()));
  $("campoSiguiente").addEventListener("focus", llenarSugerencias);
  $("campoConsejo").addEventListener("input", (e) => cambiarDato("consejo", e.target.value));
}

function cambiarDato(campo, valor) {
  estado.nivel[campo] = valor;
  avisarCambio("datos");
}

function mostrarCampos() {
  const n = estado.nivel;
  ponerValor("campoNombre", n.nombre);
  ponerValor("campoMusica", n.musica);
  ponerValor("campoFondo", n.fondo);
  ponerValor("campoSiguiente", n.siguiente);
  ponerValor("campoConsejo", n.consejo ?? "");
  ponerValor("campoAncho", anchoDe(n.mapa));
  ponerValor("campoAlto", altoDe(n.mapa));
  $("nombreArchivo").textContent = estado.archivo ? `📁 niveles/${estado.archivo}.json` : "📁 (aún sin guardar en el juego)";
}

// Solo cambiamos el campo si el niño no está escribiendo en él.
function ponerValor(id, valor) {
  const campo = $(id);
  if (document.activeElement !== campo && campo.value !== String(valor)) campo.value = valor;
}

// Sugerencias para "siguiente nivel": los niveles que ya existen.
async function llenarSugerencias() {
  try {
    const lista = await archivos.listaDeNiveles();
    $("sugerenciasNiveles").innerHTML = "";
    for (const nombre of lista) {
      const opcion = document.createElement("option");
      opcion.value = nombre;
      $("sugerenciasNiveles").appendChild(opcion);
    }
  } catch {
    // sin lista, no pasa nada
  }
}

// ---------- Atajos de teclado ----------

function prepararTeclado() {
  window.addEventListener("keydown", (e) => {
    const escribiendo = ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName);
    const control = e.ctrlKey || e.metaKey;
    if (control && e.key.toLowerCase() === "z" && !escribiendo) {
      e.preventDefault();
      if (e.shiftKey) rehacer();
      else deshacer();
    } else if (control && e.key.toLowerCase() === "y" && !escribiendo) {
      e.preventDefault();
      rehacer();
    } else if (!escribiendo && !control) {
      if (e.key === "+") cambiarZoom(+1);
      if (e.key === "-") cambiarZoom(-1);
      if (e.key === "l") elegirHerramienta("lapiz");
      if (e.key === "r") elegirHerramienta("rellenar");
      if (e.key === "e") elegirHerramienta("borrador");
    }
  });
}

// ---------- Que el editor no se recargue solo ----------
// Cuando guardamos un nivel, Vite avisa a todas las páginas que recarguen
// (el juego lee la carpeta niveles/). El editor no lo necesita, y así
// no perdemos lo que se puede deshacer.
if (import.meta.hot) {
  import.meta.hot.on("vite:beforeFullReload", (aviso) => {
    const quien = (aviso.triggeredBy || "").replace(/\\/g, "/");
    if (quien.includes("/niveles/")) aviso.path = "/no-recargar-el-editor.html";
  });
}
