// ARCHIVOS: abrir, guardar, descargar y subir niveles.

import { arreglarNivel, nivelParaGuardar } from "./validar.js";

const LLAVE_TRABAJO = "editor:trabajo";
const LLAVE_PRUEBA = "editor:nivelPrueba";

// --- Autoguardado: para no perder nada si se cierra la pestaña ---

export function autoguardar(nivel, archivo) {
  try {
    localStorage.setItem(LLAVE_TRABAJO, JSON.stringify({ nivel, archivo }));
  } catch {
    // Si el navegador no deja guardar, no pasa nada.
  }
}

export function recuperarTrabajo() {
  try {
    const guardado = JSON.parse(localStorage.getItem(LLAVE_TRABAJO));
    if (!guardado) return null;
    return { nivel: arreglarNivel(guardado.nivel).nivel, archivo: guardado.archivo || "" };
  } catch {
    return null;
  }
}

// --- Probar el nivel en el juego ---

export function probarNivel(nivel) {
  localStorage.setItem(LLAVE_PRUEBA, JSON.stringify(nivelParaGuardar(nivel)));
  const ventana = window.open("index.html?prueba=1", "_blank");
  // Si el navegador bloquea la pestaña nueva, abrimos aquí mismo.
  if (!ventana) location.href = "index.html?prueba=1";
}

// --- Niveles que ya están en el juego ---

export async function listaDeNiveles() {
  const respuesta = await fetch(`niveles/indice.json?t=${Date.now()}`);
  if (!respuesta.ok) return [];
  const indice = await respuesta.json();
  return Array.isArray(indice.niveles) ? indice.niveles : [];
}

export async function abrirNivelDelJuego(nombre) {
  const respuesta = await fetch(`niveles/${nombre}.json?t=${Date.now()}`);
  if (!respuesta.ok) throw new Error(`No encontré el nivel "${nombre}".`);
  return arreglarNivel(await respuesta.json());
}

// --- Descargar y subir archivos .json ---

// Escribimos el mapa con una fila por línea, ¡para que se vea como un dibujo!
export function nivelComoTexto(nivel) {
  return JSON.stringify(nivelParaGuardar(nivel), null, 2) + "\n";
}

export function descargar(nivel, archivo) {
  const blob = new Blob([nivelComoTexto(nivel)], { type: "application/json" });
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(blob);
  enlace.download = `${archivo}.json`;
  enlace.click();
  setTimeout(() => URL.revokeObjectURL(enlace.href), 1000);
}

export async function leerArchivoSubido(archivoSubido) {
  const texto = await archivoSubido.text();
  let datos;
  try {
    datos = JSON.parse(texto);
  } catch {
    throw new Error("Este archivo no es un .json de nivel que yo entienda.");
  }
  return arreglarNivel(datos);
}

// --- Guardar directo en la carpeta niveles/ del juego ---
// Solo funciona con "npm run dev" (el servidor de Vite tiene el ayudante).
// Devuelve { ok: true } o { ok: false, sinServidor: true } o lanza error.
export async function guardarEnElJuego(nivel, archivo) {
  let respuesta;
  try {
    respuesta = await fetch("api/guardar-nivel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archivo, nivel: nivelParaGuardar(nivel) }),
    });
  } catch {
    return { ok: false, sinServidor: true };
  }
  if (respuesta.status === 404 || respuesta.status === 405) {
    return { ok: false, sinServidor: true };
  }
  let datos = {};
  try {
    datos = await respuesta.json();
  } catch {
    return { ok: false, sinServidor: true };
  }
  if (!respuesta.ok || !datos.ok) throw new Error(datos.error || "Algo salió mal al guardar.");
  return { ok: true, nuevo: datos.nuevo };
}
