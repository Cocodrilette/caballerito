// PANTALLA DE TÍTULO
// 1. "Presiona una tecla" (así el navegador deja sonar la música).
// 2. Eliges personaje con ← →.
// 3. Si hay partida guardada: ↑ ↓ para "Continuar" o "Nueva partida".
import { ANCHO_PANTALLA, ALTO_PANTALLA, LETRA_CHICA, LETRA_MEDIANA, LETRA_GRANDE, TAMAÑO_BLOQUE } from "../config.js";
import { tocarMusica } from "../audio/sonido.js";
import { despertarAudio } from "./audio.js";
import { crearFondo } from "./fondo.js";
import { crearSelector } from "./selector.js";
import { ORDEN_NIVELES, buscarNivel } from "../niveles.js";
import { guardarPersonaje } from "../personaje.js";
import { cargarPartida, borrarPartida } from "../guardado.js";

const CENTRO = ANCHO_PANTALLA / 2;
const AMARILLO = [255, 230, 140];
const GRIS = [130, 140, 170];

export function escenaTitulo() {
  setCamPos(ANCHO_PANTALLA / 2, ALTO_PANTALLA / 2);
  crearFondo("#0b1020");

  add([text("CABALLERITO", { size: LETRA_GRANDE }), pos(CENTRO, 32), anchor("center"), color(235, 240, 255)]);
  add([text("una aventura en la cueva", { size: LETRA_CHICA }), pos(CENTRO, 54), anchor("top"), color(150, 170, 210)]);

  const partida = partidaValida();
  const selector = crearSelector(partida ? partida.personaje : null);

  const aviso = add([text("Presiona una tecla", { size: LETRA_MEDIANA }), pos(CENTRO, 166), anchor("top"), opacity(1)]);
  onUpdate(() => {
    aviso.opacity = 0.6 + 0.4 * Math.sin(time() * 4); // parpadea suavecito
  });

  const controles = add([
    text("Z saltar   X atacar   C dash\n↓ + X en el aire: ¡pogo!\n↑ en la banca: descansar", {
      size: LETRA_CHICA,
      align: "center",
      lineSpacing: 4,
    }),
    pos(CENTRO, partida ? 228 : 200),
    anchor("top"),
    color(170, 180, 210),
  ]);
  controles.hidden = true;

  // El menú: solo aparece si hay una partida guardada.
  const menu = crearMenu(partida);

  // ¿Qué pasa con cada tecla?
  let listo = false;
  const despertar = () => {
    despertarAudio();
    tocarMusica("menu");
    listo = true;
    controles.hidden = false;
    if (partida) {
      aviso.hidden = true;
      menu.mostrar();
    } else {
      aviso.text = "Presiona Z para empezar";
    }
  };

  const aceptar = () => {
    guardarPersonaje(selector.elegido());
    if (!partida) return nuevaPartida();
    menu.aceptar();
  };

  onKeyPress((tecla) => {
    if (!listo) return despertar();
    if (["left", "a"].includes(tecla)) selector.mover(-1);
    if (["right", "d"].includes(tecla)) selector.mover(1);
    if (["up", "w"].includes(tecla)) menu.mover(-1);
    if (["down", "s"].includes(tecla)) menu.mover(1);
    if (["x", "k", "escape"].includes(tecla)) menu.cancelar();
    if (["z", "j", "space", "enter"].includes(tecla)) aceptar();
  });
  onMousePress(() => (listo ? aceptar() : despertar()));
  onGamepadButtonPress((boton) => {
    if (!listo) return despertar();
    if (boton === "dpad-left") selector.mover(-1);
    if (boton === "dpad-right") selector.mover(1);
    if (boton === "dpad-up") menu.mover(-1);
    if (boton === "dpad-down") menu.mover(1);
    if (boton === "east") menu.cancelar();
    if (boton === "south" || boton === "start") aceptar();
  });
}

// La partida guardada, solo si su nivel todavía existe.
function partidaValida() {
  const partida = cargarPartida();
  if (partida && buscarNivel(partida.nivel)) return partida;
  return null;
}

// Empezar desde el primer nivel.
function nuevaPartida() {
  const primero = ORDEN_NIVELES[0];
  go("juego", { nombre: primero, datos: buscarNivel(primero), guardar: true });
}

// Seguir donde te quedaste: en la última banca, con vida llena y tu geo.
function continuar(partida) {
  const B = TAMAÑO_BLOQUE;
  const banca = partida.banca;
  go("juego", {
    nombre: partida.nivel,
    datos: buscarNivel(partida.nivel),
    geo: partida.geo || 0,
    reaparicion: banca ? vec2(banca.columna * B + B / 2, (banca.fila + 1) * B) : null,
    guardar: true,
  });
}

// Menú "Continuar / Nueva partida" (con pregunta antes de borrar).
function crearMenu(partida) {
  const nada = { mostrar() {}, mover() {}, aceptar() {}, cancelar() {} };
  if (!partida) return nada;

  const caja = add([pos(CENTRO, 162)]);
  caja.hidden = true;
  const opcion1 = caja.add([text("", { size: LETRA_MEDIANA }), anchor("top")]);
  const detalle = caja.add([
    text(`${buscarNivel(partida.nivel).nombre || partida.nivel} - ${partida.geo || 0} geo`, { size: LETRA_CHICA }),
    pos(0, 20),
    anchor("top"),
    color(170, 180, 210),
  ]);
  const opcion2 = caja.add([text("", { size: LETRA_MEDIANA }), pos(0, 36), anchor("top")]);

  let elegida = 0; // 0 = continuar, 1 = nueva partida
  let preguntando = false; // ¿estamos preguntando "seguro"?

  const pintar = () => {
    if (preguntando) {
      opcion1.text = "¿Borrar tu partida?";
      opcion1.color = rgb(...AMARILLO);
      detalle.text = "Empezarás desde el principio";
      opcion2.text = "Z: sí     X: no";
      opcion2.color = rgb(255, 255, 255);
      return;
    }
    detalle.text = `${buscarNivel(partida.nivel).nombre || partida.nivel} - ${partida.geo || 0} geo`;
    opcion1.text = (elegida === 0 ? "→ " : "  ") + "Continuar";
    opcion2.text = (elegida === 1 ? "→ " : "  ") + "Nueva partida";
    opcion1.color = rgb(...(elegida === 0 ? AMARILLO : GRIS));
    opcion2.color = rgb(...(elegida === 1 ? AMARILLO : GRIS));
  };
  pintar();

  return {
    mostrar() {
      caja.hidden = false;
    },
    mover(paso) {
      if (preguntando) return;
      elegida = (elegida + paso + 2) % 2;
      pintar();
    },
    aceptar() {
      if (preguntando) {
        borrarPartida();
        return nuevaPartida();
      }
      if (elegida === 0) return continuar(partida);
      preguntando = true;
      pintar();
    },
    cancelar() {
      preguntando = false;
      pintar();
    },
  };
}
