// EFECTOS DE SONIDO
// Cada efecto es una receta. ¡Cambia los números y escucha cómo suena!
//
//   onda              -> "sine", "triangle", "square" o "sawtooth"
//   frecuenciaInicial -> tono al empezar (número o nota como "C5")
//   frecuenciaFinal   -> tono al terminar (si sube: alegre; si baja: triste)
//   duracion          -> cuántos segundos dura
//   volumen           -> qué tan fuerte (0.05 bajito ... 0.4 fuerte)
//   ruido             -> 0 = solo tono, 1 = solo ruido "shhh"
//   eco               -> (opcional) cuánto eco de cueva (0 a 1)
//
// Si pones una LISTA [ ... ], suenan varias partes. Usa "retraso"
// (en segundos) para que una parte espere antes de sonar.

export const efectos = {
  // El caballerito salta: un tono que sube.
  salto: {
    onda: "square", frecuenciaInicial: 260, frecuenciaFinal: 620,
    duracion: 0.14, volumen: 0.19,
  },

  // El aguijón corta el aire: ¡fsssh!
  tajo: {
    onda: "triangle", frecuenciaInicial: 2600, frecuenciaFinal: 500,
    ruido: 0.85, duracion: 0.11, volumen: 0.35,
  },

  // El aguijón le pega a un enemigo.
  golpe: [
    { onda: "square", frecuenciaInicial: 420, frecuenciaFinal: 90, ruido: 0.5, duracion: 0.12, volumen: 0.35 },
    { onda: "sine", frecuenciaInicial: 180, frecuenciaFinal: 60, duracion: 0.1, volumen: 0.32 },
  ],

  // ¡Ay! El caballerito recibe daño.
  herido: [
    { onda: "sawtooth", frecuenciaInicial: 520, frecuenciaFinal: 70, ruido: 0.3, duracion: 0.35, volumen: 0.32 },
    { ruido: 1, frecuenciaInicial: 3000, frecuenciaFinal: 400, duracion: 0.25, volumen: 0.29 },
  ],

  // Recoges un geo: dos notitas brillantes.
  moneda: [
    { onda: "square", frecuenciaInicial: "B5", duracion: 0.07, volumen: 0.14 },
    { onda: "square", frecuenciaInicial: "E6", duracion: 0.22, volumen: 0.14, retraso: 0.07, eco: 0.3 },
  ],

  // Dash: un soplido rápido de viento.
  dash: {
    ruido: 1, frecuenciaInicial: 500, frecuenciaFinal: 2500,
    duracion: 0.2, volumen: 0.45,
  },

  // Descansas en la banca: un acorde tranquilo que sube.
  banca: [
    { onda: "triangle", frecuenciaInicial: "C5", duracion: 0.6, volumen: 0.19, eco: 0.6 },
    { onda: "triangle", frecuenciaInicial: "E5", duracion: 0.6, volumen: 0.19, eco: 0.6, retraso: 0.12 },
    { onda: "triangle", frecuenciaInicial: "G5", duracion: 0.6, volumen: 0.19, eco: 0.6, retraso: 0.24 },
    { onda: "sine", frecuenciaInicial: "C6", duracion: 1.0, volumen: 0.19, eco: 0.7, retraso: 0.36 },
  ],

  // El caballerito se cae rendido: un tono largo que baja.
  muerte: [
    { onda: "sawtooth", frecuenciaInicial: 440, frecuenciaFinal: 40, duracion: 1.1, volumen: 0.29, eco: 0.5 },
    { ruido: 1, frecuenciaInicial: 1200, frecuenciaFinal: 100, duracion: 0.8, volumen: 0.24 },
  ],

  // Le pegas al jefe: ¡un golpe grande y grave!
  jefe_golpe: [
    { onda: "square", frecuenciaInicial: 180, frecuenciaFinal: 40, ruido: 0.6, duracion: 0.3, volumen: 0.45 },
    { onda: "sine", frecuenciaInicial: 110, frecuenciaFinal: 35, duracion: 0.35, volumen: 0.45, eco: 0.3 },
  ],

  // Se abre la puerta al siguiente nivel.
  puerta: [
    { onda: "triangle", frecuenciaInicial: "E4", frecuenciaFinal: "B4", duracion: 0.35, volumen: 0.22, eco: 0.5 },
    { onda: "sine", frecuenciaInicial: "B4", frecuenciaFinal: "E6", duracion: 0.5, volumen: 0.19, eco: 0.6, retraso: 0.2 },
  ],

  // Pogo: rebotas sobre algo con el aguijón, ¡boing!
  pogo: [
    { onda: "square", frecuenciaInicial: 300, frecuenciaFinal: 900, duracion: 0.08, volumen: 0.19 },
    { onda: "triangle", frecuenciaInicial: 900, frecuenciaFinal: 1300, duracion: 0.1, volumen: 0.19, retraso: 0.05 },
  ],
};
