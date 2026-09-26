// MOSQUITO
// Flota tranquilo en su lugar... ¡hasta que te ve! Entonces te persigue.
// Y cada ratito hace una PICADA: tiembla (¡aviso!) y se lanza
// derechito hacia donde estabas. ¡Muévete a tiempo!
import {
  MOSQUITO_VELOCIDAD,
  MOSQUITO_VIDA,
  MOSQUITO_DISTANCIA_VISTA,
  MOSQUITO_VELOCIDAD_PICADA,
  MOSQUITO_TIEMPO_ENTRE_PICADAS,
  MOSQUITO_AVISO_PICADA,
} from "../config.js";
import { volverEnemigo } from "./comun.js";

const PASARSE_UN_POQUITO = 0.08; // la picada sigue un pelín más allá de donde estabas
const DESCANSO_PICADA = 0.4; // después de picar, se queda mareado un ratito

export function crearMosquito(nivel, x, y) {
  const mosquito = nivel.mundo.add([
    sprite("mosquito", { anim: "volar" }),
    pos(x, y),
    anchor("center"),
    area({ scale: vec2(0.8, 0.8) }),
    body({ gravityScale: 0 }), // vuela: no le afecta la gravedad
    color(),
    z(5),
    "enemigo",
    {
      casa: vec2(x, y), // el lugar donde vive
      truco: "volar", // "volar", "aviso", "picada" o "mareado"
      reloj: 0, // cuánto lleva haciendo su truco
      relojPicada: 0, // cuánto lleva persiguiéndote
      haciaPicada: vec2(0), // hacia dónde se lanza
      duracionPicada: 0, // cuánto dura la carrera (depende de qué tan lejos estás)
    },
  ]);
  volverEnemigo(mosquito, nivel, { vida: MOSQUITO_VIDA });

  mosquito.onUpdate(() => {
    mosquito.reloj += dt();
    const jugador = nivel.jugador;
    const pecho = jugador ? jugador.pos.sub(0, 12) : null; // al pecho del caballerito
    const cerca = jugador && jugador.vivo && mosquito.pos.dist(pecho) < MOSQUITO_DISTANCIA_VISTA;

    if (mosquito.truco === "aviso") {
      avisar(mosquito);
    } else if (mosquito.truco === "picada") {
      picar(mosquito);
    } else if (mosquito.truco === "mareado") {
      mosquito.vel = mosquito.vel.scale(0.9); // se va frenando
      if (mosquito.reloj > DESCANSO_PICADA) cambiarTruco(mosquito, "volar");
    } else {
      volar(mosquito, cerca, pecho);
    }
    mosquito.vel.x += mosquito.empujon;
  });

  // Los mosquitos pasan a través de las plataformas delgadas.
  mosquito.onBeforePhysicsResolve((choque) => {
    if (choque.target.is("plataforma")) choque.preventResolution();
  });

  return mosquito;
}

function cambiarTruco(mosquito, truco) {
  mosquito.truco = truco;
  mosquito.reloj = 0;
}

// VOLAR: flota en casa o te persigue. Si te persigue un buen rato... ¡picada!
function volar(mosquito, cerca, pecho) {
  let destino = mosquito.casa.add(0, Math.sin(time() * 3) * 6); // flotar
  let rapidez = MOSQUITO_VELOCIDAD * 0.5;

  if (cerca) {
    destino = pecho;
    rapidez = MOSQUITO_VELOCIDAD;
    mosquito.relojPicada += dt();
    const noTanPegado = mosquito.pos.dist(pecho) > 40; // pegadito no le hace falta picar
    if (mosquito.relojPicada > MOSQUITO_TIEMPO_ENTRE_PICADAS && noTanPegado) {
      // Recuerda dónde estabas: ahí se va a lanzar.
      mosquito.haciaPicada = pecho.sub(mosquito.pos).unit();
      mosquito.duracionPicada = mosquito.pos.dist(pecho) / MOSQUITO_VELOCIDAD_PICADA + PASARSE_UN_POQUITO;
      mosquito.relojPicada = 0;
      cambiarTruco(mosquito, "aviso");
      return;
    }
  } else {
    mosquito.relojPicada = 0;
  }

  const hacia = destino.sub(mosquito.pos);
  mosquito.vel = hacia.len() > 2 ? hacia.unit().scale(rapidez) : vec2(0);
  if (Math.abs(hacia.x) > 2) mosquito.flipX = hacia.x < 0;
}

// AVISO: se queda quieto, tiembla y parpadea en rojo.
function avisar(mosquito) {
  mosquito.vel = vec2(0);
  mosquito.pos.x += Math.sin(time() * 90) * 0.8; // temblorcito
  mosquito.color = Math.floor(time() * 20) % 2 === 0 ? rgb(255, 90, 90) : rgb(255, 255, 255);
  mosquito.flipX = mosquito.haciaPicada.x < 0;
  if (mosquito.reloj > MOSQUITO_AVISO_PICADA) cambiarTruco(mosquito, "picada");
}

// PICADA: ¡zas! derechito y muy rápido.
function picar(mosquito) {
  mosquito.vel = mosquito.haciaPicada.scale(MOSQUITO_VELOCIDAD_PICADA);
  if (mosquito.reloj > mosquito.duracionPicada) cambiarTruco(mosquito, "mareado");
}
