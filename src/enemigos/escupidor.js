// ESCUPIDOR
// Se queda quieto en el suelo. Si estás cerca y a su altura,
// infla los cachetes y... ¡PTU! te escupe una bolita.
// La bolita vuela derechito: sáltala o rómpela con el aguijón.
import {
  TAMAÑO_BLOQUE,
  ESCUPIDOR_VIDA,
  ESCUPIDOR_TIEMPO_ESCUPIR,
  ESCUPIDOR_DISTANCIA,
  BOLITA_VELOCIDAD,
} from "../config.js";
import { ponerAnimacion, chispas } from "../ayudas.js";
import { volverEnemigo } from "./comun.js";

const TIEMPO_AVISO = 0.35; // cuánto infla los cachetes antes de escupir

export function crearEscupidor(nivel, x, y) {
  const escupidor = nivel.mundo.add([
    sprite("escupidor", { anim: "quieto" }),
    pos(x, y),
    anchor("bot"),
    area({ scale: vec2(0.8, 0.85) }),
    body(),
    color(),
    z(5),
    "enemigo",
    {
      direccion: -1, // hacia dónde mira
      reloj: 0, // tiempo desde el último escupitajo
      aviso: 0, // si es más que 0, está a punto de escupir
    },
  ]);
  volverEnemigo(escupidor, nivel, { vida: ESCUPIDOR_VIDA, pesado: true });

  escupidor.onUpdate(() => {
    escupidor.vel.x = escupidor.empujon; // quieto, salvo si le pegas
    escupidor.reloj += dt();
    const jugador = nivel.jugador;

    // Inflando los cachetes... ¡PTU!
    if (escupidor.aviso > 0) {
      escupidor.aviso -= dt();
      if (escupidor.aviso <= 0) {
        escupir(escupidor, nivel);
        escupidor.reloj = 0;
      }
      return;
    }
    ponerAnimacion(escupidor, "quieto");
    if (!jugador || !jugador.vivo) return;

    // Siempre te mira.
    escupidor.direccion = jugador.pos.x < escupidor.pos.x ? -1 : 1;
    escupidor.flipX = escupidor.direccion < 0;

    if (escupidor.reloj >= ESCUPIDOR_TIEMPO_ESCUPIR && teVe(escupidor, jugador)) {
      escupidor.aviso = TIEMPO_AVISO;
      ponerAnimacion(escupidor, "escupir");
    }
  });

  return escupidor;
}

// ¿Estás cerca y más o menos a su misma altura?
function teVe(escupidor, jugador) {
  const lejosDeLado = Math.abs(jugador.pos.x - escupidor.pos.x);
  const lejosDeAlto = Math.abs(jugador.pos.y - escupidor.pos.y);
  return lejosDeLado < ESCUPIDOR_DISTANCIA && lejosDeAlto < TAMAÑO_BLOQUE * 3;
}

// Lanza una bolita que vuela recto hacia donde mira.
function escupir(escupidor, nivel) {
  const B = TAMAÑO_BLOQUE;
  const direccion = escupidor.direccion;
  const bolita = nivel.mundo.add([
    sprite("bolita", { anim: "normal" }),
    pos(escupidor.pos.add(direccion * 9, -6)), // sale de la boca
    anchor("center"),
    area(),
    z(6),
    "enemigo", // tocarla duele
    "bolita",
    { vida: 3 }, // segundos antes de secarse sola
  ]);

  // El aguijón la revienta.
  bolita.recibirGolpe = () => reventar(bolita, nivel);

  bolita.onUpdate(() => {
    bolita.pos.x += direccion * BOLITA_VELOCIDAD * dt();
    bolita.vida -= dt();
    // ¿Chocó con una roca?
    const col = Math.floor(bolita.pos.x / B);
    const fila = Math.floor(bolita.pos.y / B);
    if (nivel.esRoca(col, fila) || bolita.vida <= 0) reventar(bolita, nivel);
  });

  // Si te toca, te lastima y se deshace.
  bolita.onCollide("jugador", (jugador) => {
    jugador.herir(bolita.pos.x);
    reventar(bolita, nivel);
  });
}

function reventar(bolita, nivel) {
  if (!bolita.exists()) return;
  chispas(nivel.mundo, bolita.pos, 4, "#c8e86a");
  destroy(bolita);
}
