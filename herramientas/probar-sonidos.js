// Página para escuchar cada canción y cada efecto.
import { iniciarAudio, tocarMusica, pararMusica, efecto, silenciar } from "../src/audio/sonido.js";
import { canciones } from "../src/audio/canciones.js";
import { efectos } from "../src/audio/efectos.js";
import { crearSintetizador } from "../src/audio/sintetizador.js";
import { prepararCancion, programarPaso } from "../src/audio/reproductor.js";

const cajaCanciones = document.getElementById("canciones");
const cajaEfectos = document.getElementById("efectos");

function boton(texto, alHacerClic) {
  const b = document.createElement("button");
  b.textContent = texto;
  b.dataset.nombre = texto;
  b.addEventListener("click", () => {
    iniciarAudio();
    alHacerClic(b);
  });
  return b;
}

function marcar(b) {
  for (const otro of cajaCanciones.querySelectorAll("button")) otro.classList.remove("sonando");
  if (b) b.classList.add("sonando");
}

for (const nombre of Object.keys(canciones)) {
  cajaCanciones.append(boton(nombre, (b) => { tocarMusica(nombre); marcar(b); }));
}
cajaCanciones.append(boton("parar", () => { pararMusica(); marcar(null); }));

for (const nombre of Object.keys(efectos)) {
  cajaEfectos.append(boton(nombre, () => efecto(nombre)));
}

document.getElementById("mudo").addEventListener("change", (e) => silenciar(e.target.checked));

// ---------- Revisión sin sonido (OfflineAudioContext) ----------

const MUESTRAS = 44100;

// Mide el pico (lo más fuerte) y el promedio de energía (rms).
function medir(buffer) {
  let pico = 0;
  let suma = 0;
  let cuenta = 0;
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const datos = buffer.getChannelData(c);
    for (let i = 0; i < datos.length; i++) {
      const v = Math.abs(datos[i]);
      if (v > pico) pico = v;
      suma += v * v;
      cuenta += 1;
    }
  }
  return { pico: Number(pico.toFixed(3)), rms: Number(Math.sqrt(suma / cuenta).toFixed(4)) };
}

async function analizarCancion(cancionEnTexto) {
  const cancion = prepararCancion(cancionEnTexto);
  // Tocamos la canción una vez y media para oír también el salto del bucle.
  const pasos = Math.ceil(cancion.largo * 1.5);
  const segundos = pasos * cancion.segundosPorPaso + 3;
  const ctx = new OfflineAudioContext(2, Math.ceil(segundos * MUESTRAS), MUESTRAS);
  const sinte = crearSintetizador(ctx);
  const salida = sinte.crearSalida(1);
  for (let paso = 0; paso < pasos; paso++) {
    programarPaso(sinte, cancion, paso, 0.05 + paso * cancion.segundosPorPaso, salida);
  }
  const resultado = medir(await ctx.startRendering());
  return { ...resultado, segundos: Number(cancion.segundos.toFixed(1)) };
}

async function analizarEfecto(receta) {
  const ctx = new OfflineAudioContext(2, MUESTRAS * 3, MUESTRAS);
  const sinte = crearSintetizador(ctx);
  sinte.tocarSonido(receta, 0.05, sinte.crearSalida(1));
  return medir(await ctx.startRendering());
}

async function analizarTodo() {
  const informe = { canciones: {}, efectos: {} };
  for (const [nombre, c] of Object.entries(canciones)) informe.canciones[nombre] = await analizarCancion(c);
  for (const [nombre, e] of Object.entries(efectos)) informe.efectos[nombre] = await analizarEfecto(e);
  return informe;
}

window.analizarTodo = analizarTodo;

document.getElementById("analizar").addEventListener("click", async () => {
  const salida = document.getElementById("resultado");
  salida.textContent = "Revisando...";
  const informe = await analizarTodo();
  salida.textContent = JSON.stringify(informe, null, 2);
});
