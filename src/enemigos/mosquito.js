// MOSQUITO
// Flota tranquilo en su lugar... ¡hasta que te ve! Entonces te persigue.
import { MOSQUITO_VELOCIDAD, MOSQUITO_VIDA, MOSQUITO_DISTANCIA_VISTA } from "../config.js";
import { volverEnemigo } from "./comun.js";

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
    { casa: vec2(x, y) }, // el lugar donde vive
  ]);
  volverEnemigo(mosquito, nivel, { vida: MOSQUITO_VIDA });

  mosquito.onUpdate(() => {
    const jugador = nivel.jugador;
    let destino = mosquito.casa.add(0, Math.sin(time() * 3) * 6); // flotar
    let rapidez = MOSQUITO_VELOCIDAD * 0.5;

    const cerca = jugador && jugador.vivo && mosquito.pos.dist(jugador.pos.sub(0, 12)) < MOSQUITO_DISTANCIA_VISTA;
    if (cerca) {
      destino = jugador.pos.sub(0, 12); // al pecho del caballerito
      rapidez = MOSQUITO_VELOCIDAD;
    }

    const hacia = destino.sub(mosquito.pos);
    mosquito.vel = hacia.len() > 2 ? hacia.unit().scale(rapidez) : vec2(0);
    mosquito.vel.x += mosquito.empujon;
    if (Math.abs(hacia.x) > 2) mosquito.flipX = hacia.x < 0;
  });

  // Los mosquitos pasan a través de las plataformas delgadas.
  mosquito.onBeforePhysicsResolve((choque) => {
    if (choque.target.is("plataforma")) choque.preventResolution();
  });

  return mosquito;
}
