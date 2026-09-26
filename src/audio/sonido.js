// SONIDO DEL JUEGO
// Estas son las 5 órdenes que el juego usa para la música y los efectos:
//
//   iniciarAudio()        -> enciende el sonido (tras la primera tecla o clic)
//   tocarMusica("cueva")  -> toca una canción de src/musica/
//   pararMusica()         -> la apaga despacito
//   efecto("salto")       -> toca un efecto de efectos.js
//   silenciar(true)       -> mudo (false = vuelve el sonido)
//
// Nunca se rompen: si algo falta, solo avisan en la consola.

import { crearSintetizador } from "./sintetizador.js";
import { crearReproductor } from "./reproductor.js";
import { efectos } from "./efectos.js";
import { canciones } from "./canciones.js";

// Segundos que tarda una canción en cambiar a otra.
const FUNDIDO = 0.6;

let sintetizador = null;
let salidaEfectos = null;
let reproductor = null;
let cancionActual = null; // la que suena (o sonará al encender el audio)
let mudo = false;

// Los navegadores no dejan sonar nada hasta que la persona toca una
// tecla o hace clic. Por eso escuchamos ese primer toque.
function alPrimerToque() {
  iniciarAudio();
  if (sintetizador && sintetizador.ctx.state === "running") {
    window.removeEventListener("keydown", alPrimerToque);
    window.removeEventListener("pointerdown", alPrimerToque);
  }
}
if (typeof window !== "undefined") {
  window.addEventListener("keydown", alPrimerToque);
  window.addEventListener("pointerdown", alPrimerToque);
}

export function iniciarAudio() {
  try {
    if (!sintetizador) {
      const Contexto = window.AudioContext || window.webkitAudioContext;
      if (!Contexto) {
        console.warn("Este navegador no puede hacer sonidos. ¡El juego sigue sin música!");
        return;
      }
      sintetizador = crearSintetizador(new Contexto());
      salidaEfectos = sintetizador.crearSalida(1);
      sintetizador.silenciar(mudo);
      // Si alguien pidió música antes de encender, ahora sí suena.
      if (cancionActual) empezarCancion(cancionActual);
    }
    if (sintetizador.ctx.state === "suspended") {
      sintetizador.ctx.resume().catch(() => {});
    }
  } catch (error) {
    console.warn("No pude encender el sonido:", error);
  }
}

function empezarCancion(nombre) {
  if (reproductor) reproductor.parar(FUNDIDO);
  reproductor = crearReproductor(sintetizador, canciones[nombre]);
  reproductor.empezar(FUNDIDO);
}

export function tocarMusica(nombre) {
  try {
    if (!canciones[nombre]) {
      console.warn(`No conozco la canción "${nombre}". Las que hay: ${Object.keys(canciones).join(", ")}.`);
      return;
    }
    if (nombre === cancionActual) return; // ya está sonando
    cancionActual = nombre;
    if (sintetizador) empezarCancion(nombre);
  } catch (error) {
    console.warn("No pude tocar la música:", error);
  }
}

export function pararMusica() {
  try {
    cancionActual = null;
    if (reproductor) reproductor.parar(FUNDIDO);
    reproductor = null;
  } catch (error) {
    console.warn("No pude parar la música:", error);
  }
}

export function efecto(nombre) {
  try {
    const receta = efectos[nombre];
    if (!receta) {
      console.warn(`No conozco el efecto "${nombre}". Los que hay: ${Object.keys(efectos).join(", ")}.`);
      return;
    }
    // Si el audio aún no está encendido, simplemente no suena.
    if (!sintetizador || sintetizador.ctx.state !== "running") return;
    sintetizador.tocarSonido(receta, sintetizador.ctx.currentTime + 0.005, salidaEfectos);
  } catch (error) {
    console.warn("No pude tocar el efecto:", error);
  }
}

export function silenciar(valor) {
  mudo = Boolean(valor);
  try {
    if (sintetizador) sintetizador.silenciar(mudo);
  } catch (error) {
    console.warn("No pude cambiar el volumen:", error);
  }
}
