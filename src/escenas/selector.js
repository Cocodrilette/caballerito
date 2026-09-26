// EL SELECTOR DE PERSONAJE (en la pantalla de título)
// Muestra a los personajes en grande. Con ← → eliges.
import { ANCHO_PANTALLA, LETRA_CHICA, LETRA_MEDIANA } from "../config.js";
import { personajesDisponibles, personajeElegido } from "../personaje.js";

const CENTRO = ANCHO_PANTALLA / 2;
const SEPARACION = 140; // distancia entre los personajes
const PIES = 138; // altura donde se paran

export function crearSelector(elegidoAntes = null) {
  const lista = personajesDisponibles();
  const primero = lista.find((p) => p.sprite === elegidoAntes) || personajeElegido();
  let numero = Math.max(0, lista.indexOf(primero));

  const figuras = lista.map((personaje, i) => {
    const x = CENTRO + (i - (lista.length - 1) / 2) * SEPARACION;
    const figura = add([sprite(personaje.sprite, { anim: "quieto" }), pos(x, PIES), anchor("bot"), scale(3), opacity(1)]);
    figura.nombre = add([text(personaje.nombre, { size: LETRA_CHICA }), pos(x, PIES + 4), anchor("top")]);
    return figura;
  });

  // Flechitas para mostrar que se puede cambiar.
  if (lista.length > 1) {
    const lejos = SEPARACION / 2 + 55;
    add([text("←", { size: LETRA_MEDIANA }), pos(CENTRO - lejos, PIES - 40), anchor("top"), color(255, 230, 140)]);
    add([text("→", { size: LETRA_MEDIANA }), pos(CENTRO + lejos, PIES - 40), anchor("top"), color(255, 230, 140)]);
  }

  // El elegido corre y brilla; el otro espera tranquilo.
  const pintar = () => {
    figuras.forEach((figura, i) => {
      const esElegido = i === numero;
      figura.opacity = esElegido ? 1 : 0.35;
      figura.nombre.color = esElegido ? rgb(255, 230, 140) : rgb(120, 130, 160);
      const animacion = esElegido ? "correr" : "quieto";
      if (figura.getCurAnim()?.name !== animacion) figura.play(animacion);
    });
  };
  pintar();

  return {
    mover(paso) {
      numero = (numero + paso + lista.length) % lista.length;
      pintar();
    },
    elegido: () => lista[numero],
  };
}
