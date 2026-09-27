// TALLER DE DIBUJOS DEL CABALLERITO
// Aquí se pintan, píxel por píxel, los dibujos de src/sprites/.
// Al guardar, el servidor de Vite escribe el archivo .js de verdad.

import * as historial from "../editor/historial.js";
import { avisar, preguntar, pedirTexto } from "../editor/mensajes.js";
import { escribirSprite, revisarDibujo, letraValida, NOMBRE_ARCHIVO, NOMBRE_ANIMACION, COLOR } from "./escribir.js";

const $ = (id) => document.getElementById(id);
const LLAVE_TRABAJO = "sprites:trabajo";
const ZOOMS = [2, 3, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48];

const estado = {
  dibujo: null, // { archivo, nombre, cabecera, propios, animaciones, nuevo }
  comun: {}, // colores de paleta.js (con los cambios que aún no se guardan)
  cambiosComun: {}, // letra → color nuevo para paleta.js
  lista: [], // todos los dibujos del juego
  anim: 0,
  cuadro: 0,
  letra: "W",
  herramienta: "lapiz",
  zoom: 16,
  cuadricula: true,
  cebolla: false,
  sucio: false,
  encima: null, // el píxel donde está el ratón { x, y }
};

const HERRAMIENTAS = [
  { id: "lapiz", icono: "✏️", nombre: "Lápiz", tecla: "B" },
  { id: "borrador", icono: "🧽", nombre: "Borrador", tecla: "E" },
  { id: "cubeta", icono: "🪣", nombre: "Rellenar", tecla: "G" },
  { id: "gotero", icono: "💧", nombre: "Gotero", tecla: "I" },
];

// ---------- Ayudantes para leer el dibujo ----------

const animActual = () => estado.dibujo.animaciones[estado.anim];
const cuadroActual = () => animActual().cuadros[estado.cuadro];
const altoDe = () => estado.dibujo.animaciones[0].cuadros[0].filas.length;
const anchoDe = () => [...estado.dibujo.animaciones[0].cuadros[0].filas[0]].length;
const todosLosCuadros = () => estado.dibujo.animaciones.flatMap((a) => a.cuadros);

function colores() {
  const mapa = { ".": null, ...estado.comun };
  for (const { letra, color } of estado.dibujo.propios) mapa[letra] = color;
  return mapa;
}

function letraEn(filas, x, y) {
  return [...filas[y]][x];
}

function ponerLetra(filas, x, y, letra) {
  const fila = [...filas[y]];
  fila[x] = letra;
  filas[y] = fila.join("");
}

function letrasUsadas() {
  const usadas = new Set();
  for (const cuadro of todosLosCuadros()) for (const fila of cuadro.filas) for (const l of fila) usadas.add(l);
  return usadas;
}

// ---------- Deshacer y guardar cambios ----------

function foto() {
  return {
    dibujo: estado.dibujo, comun: estado.comun, cambiosComun: estado.cambiosComun,
    anim: estado.anim, cuadro: estado.cuadro,
  };
}

function volverA(guardada) {
  Object.assign(estado, guardada);
  marcarSucio();
  actualizarTodo();
}

// Llamar ANTES de cambiar algo, para poder deshacerlo.
function antesDeCambiar() {
  historial.guardarPaso(foto());
}

let esperaAutoguardar = null;
function marcarSucio() {
  estado.sucio = true;
  document.title = `● ${estado.dibujo.archivo} · Taller de Dibujos`;
  clearTimeout(esperaAutoguardar);
  esperaAutoguardar = setTimeout(() => {
    try {
      localStorage.setItem(LLAVE_TRABAJO, JSON.stringify({ dibujo: estado.dibujo, cambiosComun: estado.cambiosComun }));
    } catch {
      // Si el navegador no deja guardar, no pasa nada.
    }
  }, 300);
}

function marcarLimpio() {
  estado.sucio = false;
  document.title = `${estado.dibujo.archivo} · Taller de Dibujos`;
  clearTimeout(esperaAutoguardar);
  try {
    localStorage.removeItem(LLAVE_TRABAJO);
  } catch {
    // nada
  }
}

// ---------- Pintar en un lienzo ----------

function pintarFilas(pincel, filas, tam, mapa, alfa = 1) {
  pincel.globalAlpha = alfa;
  filas.forEach((fila, y) => {
    [...fila].forEach((letra, x) => {
      const color = mapa[letra];
      if (!color) return;
      pincel.fillStyle = color;
      pincel.fillRect(x * tam, y * tam, tam, tam);
    });
  });
  pincel.globalAlpha = 1;
}

function miniatura(filas, tamMaximo, mapa = colores()) {
  const ancho = [...filas[0]].length;
  const tam = Math.max(1, Math.floor(tamMaximo / Math.max(ancho, filas.length)));
  const lienzo = document.createElement("canvas");
  lienzo.width = ancho * tam;
  lienzo.height = filas.length * tam;
  pintarFilas(lienzo.getContext("2d"), filas, tam, mapa);
  return lienzo;
}

// ---------- El lienzo grande ----------

const lienzo = $("lienzo");
const pincel = lienzo.getContext("2d");

function dibujarLienzo() {
  const z = estado.zoom;
  const ancho = anchoDe();
  const alto = altoDe();
  lienzo.width = ancho * z;
  lienzo.height = alto * z;

  // Cuadritos de fondo: así se nota lo transparente.
  for (let y = 0; y < alto; y++) {
    for (let x = 0; x < ancho; x++) {
      pincel.fillStyle = (x + y) % 2 ? "#1a2244" : "#141b38";
      pincel.fillRect(x * z, y * z, z, z);
    }
  }

  const mapa = colores();
  const cuadros = animActual().cuadros;
  if (estado.cebolla && cuadros.length > 1) {
    const anterior = cuadros[(estado.cuadro - 1 + cuadros.length) % cuadros.length];
    pintarFilas(pincel, anterior.filas, z, mapa, 0.3);
  }
  // Con papel cebolla, lo de ahora va encima del cuadro anterior.
  pintarFilas(pincel, cuadroActual().filas, z, mapa);

  if (estado.cuadricula && z >= 6) {
    for (let x = 1; x < ancho; x++) {
      pincel.fillStyle = x % 8 === 0 ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)";
      pincel.fillRect(x * z, 0, 1, alto * z);
    }
    for (let y = 1; y < alto; y++) {
      pincel.fillStyle = y % 8 === 0 ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)";
      pincel.fillRect(0, y * z, ancho * z, 1);
    }
  }

  // El cuadrito donde está el ratón.
  if (estado.encima) {
    const { x, y } = estado.encima;
    pincel.strokeStyle = estado.herramienta === "borrador" ? "#ff8a80" : "#e8c170";
    pincel.lineWidth = 2;
    pincel.strokeRect(x * z + 1, y * z + 1, z - 2, z - 2);
  }
}

function pixelDelRaton(evento) {
  const caja = lienzo.getBoundingClientRect();
  const x = Math.floor(((evento.clientX - caja.left) / caja.width) * anchoDe());
  const y = Math.floor(((evento.clientY - caja.top) / caja.height) * altoDe());
  if (x < 0 || y < 0 || x >= anchoDe() || y >= altoDe()) return null;
  return { x, y };
}

// Un trazo es desde que aprietas el botón hasta que lo sueltas.
let trazo = null;

function pintarPixel(x, y) {
  const filas = cuadroActual().filas;
  if (letraEn(filas, x, y) === trazo.letra) return;
  if (!trazo.guardado) {
    antesDeCambiar();
    trazo.guardado = true;
  }
  ponerLetra(filas, x, y, trazo.letra);
}

// Línea de un punto a otro, para que no queden huecos si mueves rápido.
function linea(a, b, hacer) {
  let { x, y } = a;
  const dx = Math.abs(b.x - x);
  const dy = -Math.abs(b.y - y);
  const sx = x < b.x ? 1 : -1;
  const sy = y < b.y ? 1 : -1;
  let error = dx + dy;
  for (;;) {
    hacer(x, y);
    if (x === b.x && y === b.y) break;
    const e2 = 2 * error;
    if (e2 >= dy) { error += dy; x += sx; }
    if (e2 <= dx) { error += dx; y += sy; }
  }
}

function rellenar(x, y, letra) {
  const filas = cuadroActual().filas.map((f) => [...f]);
  const vieja = filas[y][x];
  if (vieja === letra) return;
  antesDeCambiar();
  const pendientes = [[x, y]];
  while (pendientes.length) {
    const [px, py] = pendientes.pop();
    if (py < 0 || py >= filas.length || px < 0 || px >= filas[0].length || filas[py][px] !== vieja) continue;
    filas[py][px] = letra;
    pendientes.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]);
  }
  cuadroActual().filas = filas.map((f) => f.join(""));
  cambio();
}

function prepararLienzo() {
  lienzo.addEventListener("contextmenu", (e) => e.preventDefault());

  lienzo.addEventListener("pointerdown", (e) => {
    const p = pixelDelRaton(e);
    if (!p) return;
    const borrar = e.button === 2 || estado.herramienta === "borrador";
    const letra = borrar ? "." : estado.letra;

    if (estado.herramienta === "gotero" && e.button === 0) {
      elegirLetra(letraEn(cuadroActual().filas, p.x, p.y));
      elegirHerramienta("lapiz");
      return;
    }
    if (estado.herramienta === "cubeta") {
      rellenar(p.x, p.y, letra);
      return;
    }
    lienzo.setPointerCapture(e.pointerId);
    trazo = { letra, ultimo: p, guardado: false };
    pintarPixel(p.x, p.y);
    redibujarCuadro();
  });

  lienzo.addEventListener("pointermove", (e) => {
    const p = pixelDelRaton(e);
    estado.encima = p;
    $("posicion").textContent = p
      ? `📍 x ${p.x}, y ${p.y} · letra "${letraEn(cuadroActual().filas, p.x, p.y)}"`
      : "";
    if (trazo && p) {
      linea(trazo.ultimo, p, pintarPixel);
      trazo.ultimo = p;
      redibujarCuadro();
    } else {
      dibujarLienzo();
    }
  });

  const terminar = () => {
    if (!trazo) return;
    const hubo = trazo.guardado;
    trazo = null;
    if (hubo) cambio();
  };
  lienzo.addEventListener("pointerup", terminar);
  lienzo.addEventListener("pointercancel", terminar);
  lienzo.addEventListener("pointerleave", () => {
    estado.encima = null;
    $("posicion").textContent = "";
    dibujarLienzo();
  });

  $("zonaLienzo").addEventListener("wheel", (e) => {
    e.preventDefault();
    cambiarZoom(e.deltaY < 0 ? 1 : -1);
  }, { passive: false });
}

function cambiarZoom(paso) {
  const i = ZOOMS.indexOf(estado.zoom);
  estado.zoom = ZOOMS[Math.min(ZOOMS.length - 1, Math.max(0, i + paso))];
  $("textoZoom").textContent = `${estado.zoom}×`;
  dibujarLienzo();
}

function ajustarZoomALaPantalla() {
  const zona = $("zonaLienzo");
  const cabe = Math.min((zona.clientWidth - 60) / anchoDe(), (zona.clientHeight - 60) / altoDe());
  estado.zoom = [...ZOOMS].reverse().find((z) => z <= cabe) ?? ZOOMS[0];
  $("textoZoom").textContent = `${estado.zoom}×`;
}

// ---------- Actualizar lo que se ve ----------

// Mientras pintas: solo el lienzo, la miniatura del cuadro y las letras.
function redibujarCuadro() {
  dibujarLienzo();
  const hueco = $("tiraCuadros").children[estado.cuadro]?.querySelector(".miniatura");
  if (hueco) hueco.replaceChildren(miniatura(cuadroActual().filas, 64));
  mostrarTexto();
}

// Después de cada cambio terminado.
function cambio() {
  marcarSucio();
  actualizarTodo();
}

function actualizarTodo() {
  estado.anim = Math.min(estado.anim, estado.dibujo.animaciones.length - 1);
  estado.cuadro = Math.min(estado.cuadro, animActual().cuadros.length - 1);
  dibujarLienzo();
  mostrarHerramientas();
  mostrarColores();
  mostrarCuadros();
  mostrarAnimaciones();
  mostrarTexto();
  $("campoAncho").value = anchoDe();
  $("campoAlto").value = altoDe();
  $("botonDeshacer").disabled = !historial.puedoDeshacer();
  $("botonRehacer").disabled = !historial.puedoRehacer();
  $("botonCuadricula").classList.toggle("apagado", !estado.cuadricula);
  $("botonCebolla").classList.toggle("apagado", !estado.cebolla);
  $("subtitulo").textContent = estado.dibujo.nuevo
    ? `Dibujo nuevo: src/sprites/${estado.dibujo.archivo}.js (aún no está guardado)`
    : `Pintando src/sprites/${estado.dibujo.archivo}.js`;
}

// ---------- Herramientas ----------

function mostrarHerramientas() {
  const caja = $("herramientas");
  caja.replaceChildren();
  for (const h of HERRAMIENTAS) {
    const boton = document.createElement("button");
    boton.className = "herramienta" + (estado.herramienta === h.id ? " elegido" : "");
    boton.title = `${h.nombre} (${h.tecla})`;
    boton.innerHTML = `<span class="icono">${h.icono}</span>${h.nombre}`;
    boton.addEventListener("click", () => elegirHerramienta(h.id));
    caja.appendChild(boton);
  }
}

function elegirHerramienta(id) {
  estado.herramienta = id;
  mostrarHerramientas();
  dibujarLienzo();
}

// ---------- Colores ----------

function elegirLetra(letra) {
  estado.letra = letra;
  if (letra === ".") estado.herramienta = "borrador";
  else if (estado.herramienta === "borrador") estado.herramienta = "lapiz";
  mostrarHerramientas();
  mostrarColores();
}

function botonDeColor(letra, color, usadas) {
  const boton = document.createElement("button");
  boton.className = "color" + (estado.letra === letra ? " elegido" : "") + (color ? "" : " transparente");
  if (color) boton.style.setProperty("--color", color);
  boton.title = color ? `Letra ${letra} · ${color}` : "Transparente (no se pinta nada)";
  boton.innerHTML = `<span class="letra">${letra === "." ? "·" : letra}</span>`;
  if (usadas.has(letra)) boton.classList.add("usado");
  boton.addEventListener("click", () => elegirLetra(letra));
  return boton;
}

function mostrarColores() {
  const caja = $("colores");
  caja.replaceChildren();
  const usadas = letrasUsadas();
  const propias = new Set(estado.dibujo.propios.map((p) => p.letra));

  const seccion = (titulo, botones) => {
    const h = document.createElement("h3");
    h.textContent = titulo;
    const grupo = document.createElement("div");
    grupo.className = "grupo-colores";
    grupo.append(...botones);
    caja.append(h, grupo);
  };

  seccion("De todos los dibujos", [
    botonDeColor(".", null, usadas),
    ...Object.entries(estado.comun).filter(([l]) => !propias.has(l)).map(([l, c]) => botonDeColor(l, c, usadas)),
  ]);

  const nuevo = document.createElement("button");
  nuevo.className = "color agregar";
  nuevo.title = "Agregar un color nuevo solo para este dibujo";
  nuevo.textContent = "+";
  nuevo.addEventListener("click", agregarColor);
  seccion("Solo de este dibujo", [
    ...estado.dibujo.propios.map((p) => botonDeColor(p.letra, p.color, usadas)),
    nuevo,
  ]);

  const leyenda = document.createElement("p");
  leyenda.className = "explica";
  leyenda.textContent = "El puntito • quiere decir que este dibujo usa ese color.";
  caja.appendChild(leyenda);

  mostrarEditorDeColor(usadas);
}

// La cajita de abajo para cambiar el color elegido.
let editandoColor = false;
function mostrarEditorDeColor(usadas) {
  const caja = $("editarColor");
  caja.replaceChildren();
  const letra = estado.letra;
  if (letra === ".") return;
  const propio = estado.dibujo.propios.find((p) => p.letra === letra);
  const color = propio ? propio.color : estado.comun[letra];
  if (!color) return;

  const titulo = document.createElement("h3");
  titulo.innerHTML = `Color <code></code>`;
  titulo.querySelector("code").textContent = letra;

  const entrada = document.createElement("input");
  entrada.type = "color";
  entrada.value = color;
  entrada.addEventListener("input", () => {
    if (!editandoColor) {
      antesDeCambiar();
      editandoColor = true;
    }
    if (propio) estado.dibujo.propios.find((p) => p.letra === letra).color = entrada.value;
    else {
      estado.comun[letra] = entrada.value;
      estado.cambiosComun[letra] = entrada.value;
    }
    marcarSucio();
    dibujarLienzo();
    mostrarCuadros();
  });
  entrada.addEventListener("change", () => {
    editandoColor = false;
    mostrarColores();
  });
  caja.append(titulo, entrada);

  if (propio) {
    const nota = document.createElement("input");
    nota.type = "text";
    nota.className = "entrada-chica";
    nota.placeholder = "¿Qué es? (ej: pelo dorado)";
    nota.value = propio.comentario;
    nota.addEventListener("change", () => {
      antesDeCambiar();
      estado.dibujo.propios.find((p) => p.letra === letra).comentario = nota.value.trim();
      cambio();
    });
    caja.appendChild(nota);

    const quitar = document.createElement("button");
    quitar.className = "boton";
    quitar.textContent = "🗑️ Quitar color";
    quitar.disabled = usadas.has(letra);
    quitar.title = quitar.disabled ? "Primero borra los píxeles que usan este color" : "";
    quitar.addEventListener("click", () => {
      antesDeCambiar();
      estado.dibujo.propios = estado.dibujo.propios.filter((p) => p.letra !== letra);
      estado.letra = ".";
      cambio();
    });
    caja.appendChild(quitar);
  } else {
    const ojo = document.createElement("p");
    ojo.className = "explica ojo";
    ojo.textContent = "⚠️ Este color es de TODOS los dibujos. Si lo cambias, cambia en todo el juego (en paleta.js).";
    caja.appendChild(ojo);
  }
}

async function agregarColor() {
  const libres = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"].filter((l) => !(l in colores()));
  const caja = document.createElement("div");
  caja.innerHTML = `
    <p>Cada color tiene una letra. Elige una que no se esté usando.</p>
    <div class="fila-dialogo">
      <input id="letraNueva" class="entrada-grande letra-nueva" maxlength="2">
      <input id="colorNuevo" type="color" value="#e8798a">
    </div>
    <p><input id="notaNueva" class="entrada-grande" placeholder="¿Qué es? (ej: lengua rosada)"></p>
    <p id="errorColor" class="error-texto"></p>`;
  caja.querySelector("#letraNueva").value = libres[0] ?? "";

  for (;;) {
    const ok = await preguntar("🎨 Color nuevo", caja, [
      { texto: "Cancelar", valor: false },
      { texto: "¡Agregar!", valor: true, principal: true },
    ]);
    if (!ok) return;
    const letra = caja.querySelector("#letraNueva").value.trim();
    const error = !letraValida(letra)
      ? "Escribe UNA letra (sin espacios ni comillas)."
      : letra in colores() ? `La letra "${letra}" ya tiene color. Prueba con ${libres.slice(0, 3).join(", ")}.` : "";
    caja.querySelector("#errorColor").textContent = error;
    if (error) continue;
    antesDeCambiar();
    estado.dibujo.propios.push({
      letra,
      color: caja.querySelector("#colorNuevo").value,
      comentario: caja.querySelector("#notaNueva").value.trim(),
      hueco: " ",
    });
    estado.letra = letra;
    if (estado.herramienta === "borrador") estado.herramienta = "lapiz";
    cambio();
    return;
  }
}

// ---------- Cuadros de la animación ----------

function mostrarCuadros() {
  const tira = $("tiraCuadros");
  tira.replaceChildren();
  const cuadros = animActual().cuadros;
  $("tituloCuadros").textContent = `🎞️ Cuadros de "${animActual().nombre}" (${cuadros.length})`;
  cuadros.forEach((cuadro, i) => {
    const boton = document.createElement("button");
    boton.className = "cuadro" + (i === estado.cuadro ? " elegido" : "");
    boton.title = cuadro.etiqueta || `cuadro ${i + 1}`;
    const hueco = document.createElement("span");
    hueco.className = "miniatura";
    hueco.appendChild(miniatura(cuadro.filas, 64));
    const numero = document.createElement("span");
    numero.className = "numero";
    numero.textContent = i + 1;
    boton.append(hueco, numero);
    boton.addEventListener("click", () => irACuadro(i));
    tira.appendChild(boton);
  });
  $("botonBorrarCuadro").disabled = cuadros.length <= 1;
  $("botonCuadroIzq").disabled = estado.cuadro === 0;
  $("botonCuadroDer").disabled = estado.cuadro === cuadros.length - 1;
}

function irACuadro(i) {
  const total = animActual().cuadros.length;
  estado.cuadro = (i + total) % total;
  dibujarLienzo();
  mostrarCuadros();
  mostrarTexto();
}

// Cambia la animación actual (con historial, para poder deshacer).
function cambiarAnimacion(hacer) {
  antesDeCambiar();
  hacer(animActual());
  cambio();
}

function vacio() {
  return Array.from({ length: altoDe() }, () => ".".repeat(anchoDe()));
}

// Cambia TODOS los píxeles del cuadro con una función (x, y, filas) → letra.
function transformarCuadro(hacer) {
  cambiarAnimacion((anim) => {
    const cuadro = anim.cuadros[estado.cuadro];
    const viejas = cuadro.filas.map((f) => [...f]);
    cuadro.filas = viejas.map((fila, y) => fila.map((_, x) => hacer(x, y, viejas)).join(""));
  });
}

function prepararCuadros() {
  $("botonCopiarCuadro").addEventListener("click", () => {
    cambiarAnimacion((anim) => {
      anim.cuadros.splice(estado.cuadro + 1, 0, { etiqueta: "", filas: [...cuadroActual().filas] });
      estado.cuadro++;
    });
  });
  $("botonCuadroVacio").addEventListener("click", () => {
    cambiarAnimacion((anim) => {
      anim.cuadros.splice(estado.cuadro + 1, 0, { etiqueta: "", filas: vacio() });
      estado.cuadro++;
    });
  });
  $("botonBorrarCuadro").addEventListener("click", () => {
    if (animActual().cuadros.length <= 1) return;
    cambiarAnimacion((anim) => anim.cuadros.splice(estado.cuadro, 1));
  });
  const moverCuadro = (paso) => cambiarAnimacion((anim) => {
    const destino = estado.cuadro + paso;
    if (destino < 0 || destino >= anim.cuadros.length) return;
    const [cuadro] = anim.cuadros.splice(estado.cuadro, 1);
    anim.cuadros.splice(destino, 0, cuadro);
    estado.cuadro = destino;
  });
  $("botonCuadroIzq").addEventListener("click", () => moverCuadro(-1));
  $("botonCuadroDer").addEventListener("click", () => moverCuadro(1));

  $("botonVoltear").addEventListener("click", () => {
    transformarCuadro((x, y, viejas) => viejas[y][viejas[y].length - 1 - x]);
  });
  for (const boton of document.querySelectorAll(".mover")) {
    const dx = Number(boton.dataset.dx);
    const dy = Number(boton.dataset.dy);
    boton.addEventListener("click", () => {
      transformarCuadro((x, y, viejas) => viejas[y - dy]?.[x - dx] ?? ".");
    });
  }
  $("botonLimpiar").addEventListener("click", () => transformarCuadro(() => "."));
}

// ---------- Animaciones ----------

function mostrarAnimaciones() {
  const lista = $("listaAnimaciones");
  lista.replaceChildren();
  estado.dibujo.animaciones.forEach((anim, i) => {
    const boton = document.createElement("button");
    boton.className = "boton animacion" + (i === estado.anim ? " elegido" : "");
    boton.textContent = `${anim.nombre} (${anim.cuadros.length})`;
    if (anim.comentario) boton.title = anim.comentario;
    boton.addEventListener("click", () => {
      estado.anim = i;
      estado.cuadro = 0;
      actualizarTodo();
    });
    lista.appendChild(boton);
  });
  $("campoVelocidad").value = animActual().velocidad;
  $("campoRepetir").checked = animActual().repetir;
  $("botonBorrarAnim").disabled = estado.dibujo.animaciones.length <= 1;
}

async function pedirNombreDeAnimacion(titulo, valor) {
  for (;;) {
    const nombre = await pedirTexto(titulo, "Solo letras minúsculas, números y _ (por ejemplo: bailar, dormir).", valor);
    if (nombre === null) return null;
    if (!NOMBRE_ANIMACION.test(nombre)) {
      avisar("🤔 Ese nombre no sirve: usa minúsculas sin espacios ni tildes.", "ojo");
      valor = nombre;
      continue;
    }
    if (estado.dibujo.animaciones.some((a) => a.nombre === nombre)) {
      avisar(`🤔 Ya hay una animación llamada "${nombre}".`, "ojo");
      valor = nombre;
      continue;
    }
    return nombre;
  }
}

function prepararAnimaciones() {
  $("botonNuevaAnim").addEventListener("click", async () => {
    const nombre = await pedirNombreDeAnimacion("🎬 Animación nueva", "");
    if (!nombre) return;
    antesDeCambiar();
    estado.dibujo.animaciones.push({
      nombre, comentario: "", velocidad: 6, repetir: true,
      cuadros: [{ etiqueta: "", filas: [...cuadroActual().filas] }],
    });
    estado.anim = estado.dibujo.animaciones.length - 1;
    estado.cuadro = 0;
    cambio();
    avisar("🎬 ¡Lista! Empieza con una copia del cuadro que tenías.");
  });

  $("botonRenombrarAnim").addEventListener("click", async () => {
    const nombre = await pedirNombreDeAnimacion("✏️ Nuevo nombre", animActual().nombre);
    if (!nombre) return;
    cambiarAnimacion((anim) => { anim.nombre = nombre; });
    avisar("⚠️ Ojo: si el código del juego usaba el nombre viejo, hay que cambiarlo allá también.", "ojo");
  });

  $("botonBorrarAnim").addEventListener("click", async () => {
    if (estado.dibujo.animaciones.length <= 1) return;
    const si = await preguntar("🗑️ ¿Borrar la animación?", [
      `Vas a borrar "${animActual().nombre}" con todos sus cuadros.`,
      "⚠️ Si el juego la usa, el juego podría fallar.",
      "(Puedes deshacer con Ctrl+Z.)",
    ], [
      { texto: "No, déjala", valor: false },
      { texto: "Sí, bórrala", valor: true, principal: true },
    ]);
    if (!si) return;
    antesDeCambiar();
    estado.dibujo.animaciones.splice(estado.anim, 1);
    estado.cuadro = 0;
    cambio();
  });

  $("campoVelocidad").addEventListener("change", (e) => {
    const valor = Math.max(1, Math.min(60, Math.round(Number(e.target.value)) || 1));
    cambiarAnimacion((anim) => { anim.velocidad = valor; });
  });
  $("campoRepetir").addEventListener("change", (e) => {
    cambiarAnimacion((anim) => { anim.repetir = e.target.checked; });
  });
}

// ---------- Vista previa animada ----------

function prepararPrevia() {
  const grande = $("previa");
  const chica = $("previaReal");
  let inicio = performance.now();
  let ultimaAnim = null;

  const pintar = (lienzo, filas, tam) => {
    const ancho = [...filas[0]].length * tam;
    const alto = filas.length * tam;
    if (lienzo.width !== ancho || lienzo.height !== alto) {
      lienzo.width = ancho;
      lienzo.height = alto;
    }
    const p = lienzo.getContext("2d");
    p.clearRect(0, 0, ancho, alto);
    pintarFilas(p, filas, tam, colores());
  };

  const cuadroDeAhora = (ahora) => {
    const anim = animActual();
    if (anim !== ultimaAnim) { ultimaAnim = anim; inicio = ahora; }
    const total = anim.cuadros.length;
    const pausa = anim.repetir ? 0 : 0.8; // si no repite, esperamos un poquito al final
    const ciclo = total / anim.velocidad + pausa;
    const t = ((ahora - inicio) / 1000) % ciclo;
    return anim.cuadros[Math.min(total - 1, Math.floor(t * anim.velocidad))];
  };

  const vuelta = (ahora) => {
    if (estado.dibujo) {
      const cuadro = cuadroDeAhora(ahora);
      const lado = Math.max(anchoDe(), altoDe());
      pintar(grande, cuadro.filas, Math.max(1, Math.floor(150 / lado)));
      pintar(chica, cuadro.filas, 2);
    }
    requestAnimationFrame(vuelta);
  };
  requestAnimationFrame(vuelta);
}

// ---------- Tamaño ----------

function cambiarTamano(hacer) {
  antesDeCambiar();
  for (const cuadro of todosLosCuadros()) cuadro.filas = hacer(cuadro.filas);
  cambio();
}

const TAMANO_MAXIMO = 64;
const masAncho = (filas) => filas.map((f) => f + ".");
const menosAncho = (filas) => filas.map((f) => [...f].slice(0, -1).join(""));
const masArriba = (filas) => [".".repeat([...filas[0]].length), ...filas];
const menosArriba = (filas) => filas.slice(1);

function prepararTamano() {
  $("masAncho").addEventListener("click", () => anchoDe() < TAMANO_MAXIMO && cambiarTamano(masAncho));
  $("menosAncho").addEventListener("click", () => anchoDe() > 1 && cambiarTamano(menosAncho));
  $("masAlto").addEventListener("click", () => altoDe() < TAMANO_MAXIMO && cambiarTamano(masArriba));
  $("menosAlto").addEventListener("click", () => altoDe() > 1 && cambiarTamano(menosArriba));

  const aTamano = (actual, deseado, crecer, encoger) => (filas) => {
    let resultado = filas;
    for (let n = actual; n < deseado; n++) resultado = crecer(resultado);
    for (let n = actual; n > deseado; n--) resultado = encoger(resultado);
    return resultado;
  };
  const leer = (campo) => Math.max(1, Math.min(TAMANO_MAXIMO, Math.round(Number(campo.value)) || 1));
  $("campoAncho").addEventListener("change", (e) => {
    const deseado = leer(e.target);
    if (deseado !== anchoDe()) cambiarTamano(aTamano(anchoDe(), deseado, masAncho, menosAncho));
    else e.target.value = deseado;
  });
  $("campoAlto").addEventListener("change", (e) => {
    const deseado = leer(e.target);
    if (deseado !== altoDe()) cambiarTamano(aTamano(altoDe(), deseado, masArriba, menosArriba));
    else e.target.value = deseado;
  });
}

// ---------- El cuadro en letras ----------

const textoCuadro = $("textoCuadro");
let editandoTexto = false;

function mostrarTexto() {
  if (document.activeElement === textoCuadro) return; // no le movemos el cursor a quien escribe
  textoCuadro.value = cuadroActual().filas.join("\n");
  textoCuadro.rows = altoDe();
  $("errorTexto").textContent = "";
}

function prepararTexto() {
  textoCuadro.addEventListener("input", () => {
    const filas = textoCuadro.value.replace(/\r/g, "").replace(/\n+$/, "").split("\n");
    const mapa = colores();
    let error = "";
    if (filas.length !== altoDe()) error = `Debe tener ${altoDe()} filas (ahora tiene ${filas.length}).`;
    else {
      filas.forEach((fila, f) => {
        if (error) return;
        if ([...fila].length !== anchoDe()) error = `La fila ${f + 1} debe tener ${anchoDe()} letras (tiene ${[...fila].length}).`;
        const rara = [...fila].find((l) => !(l in mapa));
        if (!error && rara) error = `La fila ${f + 1} tiene la letra "${rara}", que no tiene color.`;
      });
    }
    $("errorTexto").textContent = error ? `🤔 ${error}` : "";
    if (error) return;
    if (!editandoTexto) {
      antesDeCambiar();
      editandoTexto = true;
    }
    cuadroActual().filas = filas;
    marcarSucio();
    dibujarLienzo();
    mostrarCuadros();
  });
  textoCuadro.addEventListener("blur", () => {
    if (editandoTexto) {
      editandoTexto = false;
      actualizarTodo();
    }
    mostrarTexto();
  });
}

// ---------- Abrir, crear y guardar ----------

async function pedirLista() {
  const respuesta = await fetch(`/api/sprites?t=${Date.now()}`);
  const datos = await respuesta.json();
  if (!datos.ok) throw new Error(datos.error);
  for (const error of datos.errores) avisar(`🤕 ${error}`, "mal");
  return datos;
}

function abrir(dibujo, comun, cambiosComun = {}) {
  estado.dibujo = dibujo;
  estado.comun = { ...comun, ...cambiosComun };
  estado.cambiosComun = cambiosComun;
  estado.anim = 0;
  estado.cuadro = 0;
  if (!(estado.letra in colores())) estado.letra = "W" in colores() ? "W" : ".";
  actualizarTodo();
  ajustarZoomALaPantalla(); // después de actualizar, cuando ya se sabe cuánto espacio queda
  dibujarLienzo();
}

async function siHayCambiosPreguntar() {
  if (!estado.sucio) return true;
  return preguntar("✋ ¿Sin guardar?", "Tienes cambios sin guardar en este dibujo. Si sigues, se pierden.", [
    { texto: "Volver", valor: false },
    { texto: "Seguir igual", valor: true, principal: true },
  ]);
}

async function elegirDibujo() {
  // Preguntamos antes de mostrar la lista: dos ventanitas seguidas se pisan.
  if (!(await siHayCambiosPreguntar())) return;
  let datos;
  try {
    datos = await pedirLista();
  } catch {
    return sinServidor();
  }
  estado.lista = datos.dibujos;
  const caja = document.createElement("div");
  caja.className = "lista-dibujos";
  const elegido = new Promise((listo) => {
    for (const dibujo of datos.dibujos) {
      const boton = document.createElement("button");
      boton.className = "dibujo-del-juego";
      const mapa = { ...datos.comun };
      for (const { letra, color } of dibujo.propios) mapa[letra] = color;
      boton.append(miniatura(dibujo.animaciones[0].cuadros[0].filas, 56, mapa));
      const nombre = document.createElement("span");
      nombre.textContent = dibujo.archivo;
      boton.appendChild(nombre);
      boton.addEventListener("click", () => {
        listo(dibujo);
        $("dialogo").close();
      });
      caja.appendChild(boton);
    }
  });
  $("dialogo").classList.add("ancho");
  const cerrado = preguntar("📂 ¿Qué dibujo quieres pintar?", caja, [{ texto: "Cancelar", valor: null }]);
  const dibujo = await Promise.race([elegido, cerrado]);
  $("dialogo").classList.remove("ancho");
  if (!dibujo) return;
  historial.guardarPaso(foto());
  abrir(dibujo, datos.comun);
  marcarLimpio();
}

function sinServidor() {
  return preguntar("🔌 Falta encender el juego", [
    "El Taller de Dibujos necesita el servidor del juego para leer y guardar los dibujos.",
    "Abre la terminal en la carpeta del juego y escribe: npm run dev",
    "Luego abre http://localhost:5173/sprites.html",
  ], [{ texto: "¡Entendido!", valor: true, principal: true }]);
}

function nombreParaArchivo(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9_]+/g, "_").replace(/^[^a-z]+/, "").replace(/_+$/, "").slice(0, 40);
}

async function dibujoNuevo() {
  if (!(await siHayCambiosPreguntar())) return;
  const caja = document.createElement("div");
  caja.innerHTML = `
    <p>¿Cómo se llama tu dibujo? (será el archivo src/sprites/<b>nombre</b>.js)</p>
    <p><input id="nombreNuevo" class="entrada-grande" placeholder="ej: murcielago"></p>
    <div class="fila-dialogo">
      <label>↔️ Ancho <input id="anchoNuevo" class="entrada-grande" type="number" min="1" max="64" value="16"></label>
      <label>↕️ Alto <input id="altoNuevo" class="entrada-grande" type="number" min="1" max="64" value="16"></label>
    </div>
    <p class="explica">El caballerito mide 16 × 24. Un bloque del suelo mide 16 × 16.</p>
    <p id="errorNuevo" class="error-texto"></p>`;
  for (;;) {
    const ok = await preguntar("📄 Dibujo nuevo", caja, [
      { texto: "Cancelar", valor: false },
      { texto: "¡Crear!", valor: true, principal: true },
    ]);
    if (!ok) return;
    const nombre = nombreParaArchivo(caja.querySelector("#nombreNuevo").value);
    const ancho = Math.max(1, Math.min(TAMANO_MAXIMO, Number(caja.querySelector("#anchoNuevo").value) || 16));
    const alto = Math.max(1, Math.min(TAMANO_MAXIMO, Number(caja.querySelector("#altoNuevo").value) || 16));
    const error = !NOMBRE_ARCHIVO.test(nombre) || nombre === "paleta"
      ? "Escribe un nombre que empiece con una letra."
      : estado.lista.some((d) => d.archivo === nombre) ? `Ya existe un dibujo llamado "${nombre}". ¡Ábrelo con 📂!` : "";
    caja.querySelector("#errorNuevo").textContent = error;
    if (error) continue;

    historial.guardarPaso(foto());
    abrir({
      archivo: nombre, nombre, cabecera: "", propios: [], nuevo: true,
      animaciones: [{
        nombre: "normal", comentario: "", velocidad: 6, repetir: true,
        cuadros: [{ etiqueta: "", filas: Array.from({ length: alto }, () => ".".repeat(ancho)) }],
      }],
    }, estado.comun, estado.cambiosComun);
    marcarSucio();
    return;
  }
}

async function guardar() {
  const problemas = revisarDibujo({ ...estado.dibujo, comun: estado.comun });
  if (problemas.length > 0) {
    return preguntar("🤕 Hay que arreglar algo", problemas.slice(0, 8), [
      { texto: "Ok", valor: true, principal: true },
    ]);
  }
  const letrasComunes = Object.keys(estado.cambiosComun);
  if (letrasComunes.length > 0) {
    const si = await preguntar("🌈 ¿Cambiar colores de todo el juego?", [
      `Cambiaste colores que usan TODOS los dibujos: ${letrasComunes.join(", ")}.`,
      "Se van a guardar en paleta.js y se verán distintos en todo el juego.",
    ], [
      { texto: "Mejor no", valor: false },
      { texto: "¡Sí, guardar!", valor: true, principal: true },
    ]);
    if (!si) return;
  }

  const { archivo, nuevo, ...dibujo } = estado.dibujo;
  let respuesta;
  try {
    respuesta = await fetch("/api/sprites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archivo, dibujo, cambiosComun: estado.cambiosComun }),
    });
  } catch {
    return sinServidor();
  }
  if (respuesta.status === 404 || respuesta.status === 405) return sinServidor();
  const datos = await respuesta.json().catch(() => ({ ok: false, error: "El servidor no contestó bien." }));
  if (!datos.ok) {
    return preguntar("🤕 No se pudo guardar", datos.error.split("\n").slice(0, 8), [
      { texto: "Ok", valor: true, principal: true },
    ]);
  }

  estado.dibujo = { ...estado.dibujo, nuevo: false };
  estado.cambiosComun = {};
  marcarLimpio();
  actualizarTodo();
  avisar(nuevo
    ? `💾 ¡Guardado en src/sprites/${archivo}.js! Para verlo en el juego, úsalo en el código con sprite("${archivo}").`
    : "💾 ¡Guardado! Si el juego está abierto, ya tiene tu dibujo.");
  pedirLista().then((d) => { estado.lista = d.dibujos; }).catch(() => {});
}

function verCodigo() {
  const pre = document.createElement("pre");
  pre.className = "vista-json codigo";
  pre.textContent = escribirSprite(estado.dibujo);
  $("dialogo").classList.add("ancho");
  preguntar(`📜 src/sprites/${estado.dibujo.archivo}.js`, pre, [
    { texto: "Cerrar", valor: true, principal: true },
  ]).then(() => $("dialogo").classList.remove("ancho"));
}

// ---------- Botones y teclado ----------

function deshacer() {
  const anterior = historial.deshacer(foto());
  if (anterior) volverA(anterior);
}

function rehacer() {
  const siguiente = historial.rehacer(foto());
  if (siguiente) volverA(siguiente);
}

function prepararBotones() {
  $("botonAbrir").addEventListener("click", elegirDibujo);
  $("botonNuevo").addEventListener("click", dibujoNuevo);
  $("botonGuardar").addEventListener("click", guardar);
  $("botonCodigo").addEventListener("click", verCodigo);
  $("botonDeshacer").addEventListener("click", deshacer);
  $("botonRehacer").addEventListener("click", rehacer);
  $("botonAcercar").addEventListener("click", () => cambiarZoom(1));
  $("botonAlejar").addEventListener("click", () => cambiarZoom(-1));
  $("botonCuadricula").addEventListener("click", () => {
    estado.cuadricula = !estado.cuadricula;
    actualizarTodo();
  });
  $("botonCebolla").addEventListener("click", () => {
    estado.cebolla = !estado.cebolla;
    actualizarTodo();
  });
  window.addEventListener("beforeunload", (e) => {
    if (estado.sucio) e.preventDefault();
  });
}

function prepararTeclado() {
  document.addEventListener("keydown", (e) => {
    const control = e.ctrlKey || e.metaKey;
    const tecla = e.key.toLowerCase();
    if (control && tecla === "s") {
      e.preventDefault();
      guardar();
      return;
    }
    if (e.target.closest("input, textarea, select") || $("dialogo").open) return;
    if (control && tecla === "z" && !e.shiftKey) { e.preventDefault(); deshacer(); return; }
    if (control && (tecla === "y" || (tecla === "z" && e.shiftKey))) { e.preventDefault(); rehacer(); return; }
    if (control || e.altKey) return;

    const herramienta = HERRAMIENTAS.find((h) => h.tecla.toLowerCase() === tecla);
    if (herramienta) elegirHerramienta(herramienta.id);
    else if (e.key === "ArrowLeft") irACuadro(estado.cuadro - 1);
    else if (e.key === "ArrowRight") irACuadro(estado.cuadro + 1);
    else if (e.key === "+" || e.key === "=") cambiarZoom(1);
    else if (e.key === "-") cambiarZoom(-1);
    else if (tecla === "c") $("botonCuadricula").click();
    else if (tecla === "o") $("botonCebolla").click();
    else return;
    e.preventDefault();
  });
}

// ---------- Empezar ----------

prepararLienzo();
prepararCuadros();
prepararAnimaciones();
prepararTamano();
prepararTexto();
prepararBotones();
prepararTeclado();

try {
  const datos = await pedirLista();
  estado.lista = datos.dibujos;
  let trabajo = null;
  try {
    trabajo = JSON.parse(localStorage.getItem(LLAVE_TRABAJO));
  } catch {
    // nada guardado
  }
  if (trabajo?.dibujo?.animaciones?.length) {
    abrir(trabajo.dibujo, datos.comun, trabajo.cambiosComun ?? {});
    marcarSucio();
    avisar("👋 ¡Hola de nuevo! Aquí está tu dibujo como lo dejaste (aún sin guardar).");
  } else {
    const primero = datos.dibujos.find((d) => d.archivo === "caballero") ?? datos.dibujos[0];
    abrir(primero, datos.comun);
    marcarLimpio();
  }
  prepararPrevia();
} catch (error) {
  console.error(error);
  sinServidor();
}
