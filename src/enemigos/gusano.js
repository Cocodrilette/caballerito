// GUSANO
// Camina de un lado a otro. Si ve una pared o un borde, se da la vuelta.
import { TAMAÑO_BLOQUE, GUSANO_VELOCIDAD, GUSANO_VIDA } from "../config.js";
import { volverEnemigo } from "./comun.js";

export function crearGusano(nivel, x, y) {
  const gusano = nivel.mundo.add([
    sprite("gusano", { anim: "caminar" }),
    pos(x, y),
    anchor("bot"),
    area({ scale: vec2(0.8, 0.8) }),
    body(),
    color(),
    z(5),
    "enemigo",
    { direccion: -1 }, // -1 = izquierda, 1 = derecha
  ]);
  volverEnemigo(gusano, nivel, { vida: GUSANO_VIDA });

  gusano.onUpdate(() => {
    if (gusano.isGrounded() && hayQueVoltear(gusano, nivel)) {
      gusano.direccion *= -1;
    }
    gusano.vel.x = gusano.direccion * GUSANO_VELOCIDAD + gusano.empujon;
    gusano.flipX = gusano.direccion < 0;
  });

  return gusano;
}

// Mira la casilla de adelante: ¿hay pared o pinchos? ¿se acaba el suelo?
function hayQueVoltear(gusano, nivel) {
  const B = TAMAÑO_BLOQUE;
  const columnaAdelante = Math.floor((gusano.pos.x + gusano.direccion * 9) / B);
  const filaDeLosPies = Math.floor((gusano.pos.y - 1) / B);

  const hayPared = nivel.esRoca(columnaAdelante, filaDeLosPies) || nivel.esPinchos(columnaAdelante, filaDeLosPies);
  const hayBorde = !nivel.esPiso(columnaAdelante, filaDeLosPies + 1);
  return hayPared || hayBorde;
}
