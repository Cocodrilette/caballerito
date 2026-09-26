// VER COMO TEXTO
// ¡Un nivel son solo letras! Aquí puedes ver y cambiar el mapa
// escribiendo, y el dibujo se actualiza solito.

import { LEYENDA } from "../leyenda.js";
import { estado, avisarCambio } from "./estado.js";
import { emparejarFilas } from "./mapa.js";
import { guardarPaso } from "./historial.js";
import { nivelComoTexto } from "./archivos.js";

let areaTexto, vistaJson;
let esperando = null;
let fotoAntes = null; // cómo era el nivel antes de empezar a escribir

export function prepararTexto() {
  areaTexto = document.getElementById("textoMapa");
  vistaJson = document.getElementById("vistaJson");

  areaTexto.addEventListener("input", () => {
    if (!fotoAntes) fotoAntes = JSON.stringify(estado.nivel);
    clearTimeout(esperando);
    esperando = setTimeout(leerTexto, 250);
  });
  // Al salir del cuadro de texto, lo ordenamos (filas del mismo largo)
  areaTexto.addEventListener("blur", () => {
    clearTimeout(esperando);
    leerTexto();
    fotoAntes = null;
    mostrarTexto(true);
  });

  // La leyenda: qué significa cada letra
  const lista = document.getElementById("leyendaTexto");
  for (const cosa of LEYENDA) {
    const li = document.createElement("li");
    const letra = document.createElement("code");
    letra.textContent = cosa.simbolo === " " ? "␣" : cosa.simbolo;
    li.append(letra, ` ${cosa.nombre}`);
    lista.appendChild(li);
  }
}

// Lee lo que el niño escribió y lo pone en el mapa.
function leerTexto() {
  const filas = areaTexto.value.replace(/\r/g, "").split("\n");
  while (filas.length > 1 && filas[filas.length - 1] === "") filas.pop();
  if (filas.length === 0 || (filas.length === 1 && filas[0] === "")) return;
  emparejarFilas(filas);
  if (filas.join("\n") === estado.nivel.mapa.join("\n")) return;
  if (fotoAntes) {
    guardarPaso(fotoAntes);
    fotoAntes = null;
  }
  estado.nivel.mapa = filas;
  avisarCambio("texto");
}

// Muestra el mapa en el cuadro de texto (si no lo están editando).
export function mostrarTexto(forzar = false) {
  if (forzar || document.activeElement !== areaTexto) {
    const nuevo = estado.nivel.mapa.join("\n");
    if (areaTexto.value !== nuevo) areaTexto.value = nuevo;
    areaTexto.rows = estado.nivel.mapa.length + 1;
    areaTexto.cols = estado.nivel.mapa[0].length + 2;
  }
  vistaJson.textContent = nivelComoTexto(estado.nivel);
}
