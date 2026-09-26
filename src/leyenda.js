// LEYENDA DEL MAPA
// Cada letra del mapa de un nivel se convierte en una cosa del juego.
// El juego y el editor de niveles usan esta misma lista.
//
// ¿Quieres un objeto nuevo? Agrégalo aquí y luego dile al juego
// cómo crearlo en src/niveles.js.

export const LEYENDA = [
  { simbolo: " ", nombre: "Vacío",        sprite: null,         tipo: "vacio",      color: "#0b1020", descripcion: "Aire. Aquí no hay nada." },
  { simbolo: "=", nombre: "Suelo",        sprite: "suelo",      tipo: "bloque",     color: "#3a4466", descripcion: "Roca sólida. No se puede atravesar." },
  { simbolo: "-", nombre: "Plataforma",   sprite: "plataforma", tipo: "bloque",     color: "#8b6d4b", descripcion: "Puedes saltar desde abajo y pararte encima." },
  { simbolo: "^", nombre: "Pinchos",      sprite: "pinchos",    tipo: "peligro",    color: "#c0cbdc", descripcion: "¡Cuidado! Quitan una máscara." },
  { simbolo: "@", nombre: "Inicio",       sprite: "caballero",  tipo: "jugador",    color: "#ffffff", descripcion: "Aquí aparece el caballerito. Solo uno por nivel." },
  { simbolo: "B", nombre: "Banca",        sprite: "banca",      tipo: "objeto",     color: "#b86f50", descripcion: "Descansa aquí: recuperas vida y guardas tu avance." },
  { simbolo: "$", nombre: "Geo",          sprite: "moneda",     tipo: "objeto",     color: "#e8c170", descripcion: "Moneda brillante. ¡Colecciónalas!" },
  { simbolo: ">", nombre: "Puerta",       sprite: "puerta",     tipo: "objeto",     color: "#6dd3ff", descripcion: "Salida al siguiente nivel." },
  { simbolo: "g", nombre: "Gusano",       sprite: "gusano",     tipo: "enemigo",    color: "#e57373", descripcion: "Camina de lado a lado. Un golpe fácil." },
  { simbolo: "m", nombre: "Mosquito",     sprite: "mosquito",   tipo: "enemigo",    color: "#ba68c8", descripcion: "Vuela hacia ti cuando te ve." },
  { simbolo: "e", nombre: "Escupidor",    sprite: "escupidor",  tipo: "enemigo",    color: "#a5d65a", descripcion: "Se queda quieto y te escupe bolitas. ¡Sáltalas!" },
  { simbolo: "J", nombre: "Jefe",         sprite: "jefe",       tipo: "enemigo",    color: "#ff5252", descripcion: "El Gran Escarabajo. Embiste y salta." },
  { simbolo: "*", nombre: "Cristal",      sprite: "cristal",    tipo: "decoracion", color: "#7fdbff", descripcion: "Decoración que brilla. No hace nada." },
  { simbolo: "h", nombre: "Hongo",        sprite: "hongo",      tipo: "decoracion", color: "#9ccc65", descripcion: "Decoración. Un hongo de cueva." },
];

// Buscar la información de un símbolo, por ejemplo: infoDe("g")
export function infoDe(simbolo) {
  return LEYENDA.find((cosa) => cosa.simbolo === simbolo);
}
