// REPRODUCTOR DE CANCIONES
// Lee las canciones escritas como texto (en src/musica/) y las toca
// en bucle, sin cortes.
//
// Truco de músico: no esperamos a que llegue cada nota. Miramos un
// poquito hacia el futuro y dejamos las notas "programadas" en el reloj
// del audio, que es muy preciso. Así nunca se atrasan.

import { notaAFrecuencia } from "./sintetizador.js";
import { instrumentos } from "./instrumentos.js";

// Cada cuánto revisamos si hay notas nuevas (milisegundos).
const REVISAR_CADA = 25;
// Cuántos segundos hacia el futuro programamos las notas.
const MIRAR_ADELANTE = 0.15;
// Si la pestaña está escondida, el navegador nos despierta poco:
// entonces miramos más lejos para que la música no se corte.
const MIRAR_ADELANTE_ESCONDIDO = 1.5;
// Volumen de la música (0 a 1). Más bajito que los efectos para oírlos bien.
const VOLUMEN_MUSICA = 0.75;

// Convierte el texto de una canción en una lista de pasos.
// Cada paso es null (nada empieza aquí) o { frecuencias, pasos }.
export function prepararCancion(cancion) {
  const tempo = cancion.tempo > 0 ? cancion.tempo : 100;
  const pistas = [];

  for (const pista of cancion.pistas ?? []) {
    const instrumento = instrumentos[pista.instrumento];
    if (!instrumento) {
      console.warn(`Canción "${cancion.nombre}": no conozco el instrumento "${pista.instrumento}".`);
      continue;
    }

    const palabras = String(pista.notas ?? "")
      .split(/\s+/)
      .filter((p) => p !== "" && p !== "|");
    const pasos = [];
    let ultima = null; // la última nota, por si viene un "-"

    for (const palabra of palabras) {
      if (palabra === "-") {
        // Sostener: la nota anterior dura un paso más.
        if (ultima) ultima.pasos += 1;
        pasos.push(null);
      } else if (palabra === ".") {
        // Silencio.
        ultima = null;
        pasos.push(null);
      } else if (instrumento.percusion) {
        // En los tambores cualquier palabra (por ejemplo "x") es un golpe.
        ultima = { frecuencias: [], pasos: 1 };
        pasos.push(ultima);
      } else {
        // Una nota como "E4", o un acorde como "E3+G3+B3".
        const frecuencias = palabra.split("+").map(notaAFrecuencia);
        if (frecuencias.some((f) => f === null)) {
          console.warn(`Canción "${cancion.nombre}": no entiendo la nota "${palabra}". La cambio por silencio.`);
          ultima = null;
          pasos.push(null);
        } else {
          ultima = { frecuencias, pasos: 1 };
          pasos.push(ultima);
        }
      }
    }

    if (pasos.length > 0) {
      pistas.push({ instrumento, volumen: pista.volumen ?? 1, pasos });
    }
  }

  // La canción dura lo que dure su pista más larga.
  // Las pistas más cortas vuelven a empezar (útil para los tambores).
  const largo = Math.max(1, ...pistas.map((p) => p.pasos.length));
  const segundosPorPaso = 60 / tempo;
  return { nombre: cancion.nombre, pistas, largo, segundosPorPaso, segundos: largo * segundosPorPaso };
}

// Programa todas las notas que empiezan en el paso número "paso".
export function programarPaso(sintetizador, cancion, paso, tiempo, salida) {
  const pasoEnCancion = paso % cancion.largo;
  for (const pista of cancion.pistas) {
    const evento = pista.pasos[pasoEnCancion % pista.pasos.length];
    if (!evento) continue;
    const instrumento = pista.volumen === 1
      ? pista.instrumento
      : { ...pista.instrumento, volumen: (pista.instrumento.volumen ?? 0.2) * pista.volumen };

    if (instrumento.percusion) {
      sintetizador.tocarSonido(instrumento, tiempo, salida);
    } else {
      const duracion = evento.pasos * cancion.segundosPorPaso;
      for (const frecuencia of evento.frecuencias) {
        sintetizador.tocarNota(instrumento, frecuencia, tiempo, duracion, salida);
      }
    }
  }
}

// Crea un reproductor para una canción. Tiene empezar() y parar().
export function crearReproductor(sintetizador, cancionEnTexto) {
  const ctx = sintetizador.ctx;
  const cancion = prepararCancion(cancionEnTexto);
  const salida = sintetizador.crearSalida(0);
  let paso = 0;
  let siguienteTiempo = 0;
  let reloj = null;

  function programar() {
    const ahora = ctx.currentTime;
    const escondido = typeof document !== "undefined" && document.hidden;
    const adelante = escondido ? MIRAR_ADELANTE_ESCONDIDO : MIRAR_ADELANTE;

    // Si nos quedamos dormidos, saltamos al presente en vez de amontonar notas.
    if (siguienteTiempo < ahora) {
      const perdidos = Math.ceil((ahora - siguienteTiempo) / cancion.segundosPorPaso);
      paso += perdidos;
      siguienteTiempo += perdidos * cancion.segundosPorPaso;
    }

    while (siguienteTiempo < ahora + adelante) {
      programarPaso(sintetizador, cancion, paso, siguienteTiempo, salida);
      paso += 1;
      siguienteTiempo += cancion.segundosPorPaso;
    }
  }

  return {
    nombre: cancion.nombre,
    empezar(fundido = 0.5) {
      siguienteTiempo = ctx.currentTime + 0.05;
      salida.fundir(VOLUMEN_MUSICA, fundido);
      programar();
      reloj = setInterval(programar, REVISAR_CADA);
    },
    parar(fundido = 0.5) {
      clearInterval(reloj);
      salida.fundir(0, fundido);
      // Esperamos a que termine el fundido (y el eco) para desconectar.
      setTimeout(() => salida.desconectar(), (fundido + 3) * 1000);
    },
  };
}
