// LA ESCENA DEL JUEGO
// Arma un nivel completo: fondo, mapa, caballerito, HUD, cámara y pausa.
import { GRAVEDAD, VIDAS_MAXIMAS, TIEMPO_REAPARECER, ANCHO_PANTALLA, LETRA_CHICA, LETRA_MEDIANA } from "../config.js";
import { tocarMusica } from "../audio/sonido.js";
import { construirNivel, buscarNivel } from "../niveles.js";
import { crearJugador } from "../jugador.js";
import { crearHud } from "../hud.js";
import { guardarPartida } from "../guardado.js";
import { personajeElegido } from "../personaje.js";
import { crearFondo, crearPolvo } from "./fondo.js";
import { seguirConCamara } from "./camara.js";
import { prepararPausa } from "./pausa.js";
import { conectarObjetos, oscurecerYLuego } from "./interacciones.js";
import { despertarAudio, audioEstaDespierto } from "./audio.js";

// guardar = true solo en una partida normal (no en ?prueba=1 ni ?nivel=)
export function escenaJuego({ nombre, datos, geo = 0, vidas = VIDAS_MAXIMAS, reaparicion = null, guardar = false }) {
  // Lo que el caballerito lleva consigo.
  const estado = { nombre, geo, vidas, reaparicion, guardar };

  setGravity(GRAVEDAD);
  crearFondo(datos.fondo);

  // "mundo" guarda todo lo del nivel. Si lo pausamos, todo se congela.
  const mundo = add([]);
  const nivel = construirNivel(datos, mundo);
  if (!estado.reaparicion) estado.reaparicion = nivel.inicio;

  const jugador = crearJugador(nivel, estado, estado.reaparicion);
  crearPolvo(mundo);
  conectarObjetos(nivel, estado, () => irAlSiguiente(datos, estado));
  crearHud(estado);
  seguirConCamara(nivel);
  prepararPausa(mundo);
  prepararJefe(nivel, datos);
  ponerMusica(datos.musica || "cueva");
  mostrarNombre(datos.nombre || nombre, datos.consejo);

  // Si pierdes todas las máscaras: vuelves a la última banca, sin geo.
  jugador.on("morir", () => {
    wait(TIEMPO_REAPARECER, () => {
      oscurecerYLuego(() => {
        go("juego", { nombre, datos, geo: 0, vidas: VIDAS_MAXIMAS, reaparicion: estado.reaparicion, guardar });
      });
    });
  });
}

// La puerta lleva al nivel "siguiente". Si no hay, ¡ganaste!
function irAlSiguiente(datos, estado) {
  const siguiente = datos.siguiente;
  if (siguiente && buscarNivel(siguiente)) {
    if (estado.guardar) {
      guardarPartida({
        nivel: siguiente,
        banca: null, // null = empezar en el inicio del nivel
        geo: estado.geo,
        vidasMaximas: VIDAS_MAXIMAS,
        personaje: personajeElegido().sprite,
      });
    }
    go("juego", {
      nombre: siguiente,
      datos: buscarNivel(siguiente),
      geo: estado.geo,
      vidas: estado.vidas,
      guardar: estado.guardar,
    });
  } else {
    go("victoria", { geo: estado.geo });
  }
}

// En el nivel del jefe, la puerta aparece solo cuando lo vences.
function prepararJefe(nivel, datos) {
  if (!nivel.tieneJefe) return;
  const puertas = nivel.mundo.get("puerta");
  for (const puerta of puertas) {
    puerta.abierta = false;
    puerta.hidden = true;
  }
  nivel.alDerrotarJefe = () => {
    for (const puerta of puertas) {
      puerta.abierta = true;
      puerta.hidden = false;
    }
    tocarMusica(datos.musica || "cueva");
  };
}

function ponerMusica(cancion) {
  tocarMusica(cancion);
  // Si entraste directo (sin pasar por el título), el audio despierta con la primera tecla.
  if (!audioEstaDespierto()) {
    const espera = onKeyPress(() => {
      despertarAudio();
      tocarMusica(cancion);
      espera.cancel();
    });
  }
}

// El nombre del nivel (y un consejo, si hay) aparece y se desvanece.
function mostrarNombre(titulo, consejo = "") {
  const letrero = add([pos(ANCHO_PANTALLA / 2, 60), fixed(), z(150), opacity(1), { reloj: 0 }]);
  const nombre = letrero.add([text(titulo, { size: LETRA_MEDIANA }), anchor("center"), color(220, 230, 255), opacity(1)]);
  const pista = letrero.add([text(consejo, { size: LETRA_CHICA }), pos(0, 18), anchor("top"), color(255, 230, 140), opacity(1)]);

  letrero.onUpdate(() => {
    letrero.reloj += dt();
    if (letrero.reloj > 3) {
      nombre.opacity -= dt();
      pista.opacity = nombre.opacity;
    }
    if (nombre.opacity <= 0) destroy(letrero);
  });
}
