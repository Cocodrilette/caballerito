// INSTRUMENTOS
// Cada instrumento es una receta de sonido. ¡Cambia los números y escucha!
//
//   onda      -> "sine", "triangle", "square" o "sawtooth"
//   volumen   -> qué tan fuerte (0.05 bajito ... 0.4 fuerte)
//   ataque    -> segundos hasta sonar fuerte (0.005 = de golpe)
//   decaer    -> segundos hasta bajar al volumen de "sostener"
//   sostener  -> volumen mientras la nota dura (0 a 1)
//   soltar    -> segundos que tarda en apagarse
//   eco       -> cuánto eco de cueva (0 a 1)
//   filtro    -> (opcional) quita lo agudo; número más bajo = más suave
//   desafinar -> (opcional) dos ondas un poquito distintas: suena más "gordo"
//   armonico  -> (opcional) un segundo tono más agudo, como una campana
//   vibrato   -> (opcional) la nota tiembla
//
// Los instrumentos con "percusion: true" son tambores: no tienen nota,
// solo suenan como un efecto (mira efectos.js para ver esas palabras).

export const instrumentos = {
  // Campana de cristal, suena y se apaga despacito.
  campana: {
    onda: "sine", volumen: 0.16,
    ataque: 0.005, decaer: 1.4, sostener: 0, soltar: 1.2,
    armonico: { multiplicar: 3, volumen: 0.25 },
    eco: 0.7,
  },

  // Cajita de música, aguda y delicada.
  cajita: {
    onda: "sine", volumen: 0.13,
    ataque: 0.003, decaer: 0.9, sostener: 0, soltar: 0.6,
    armonico: { multiplicar: 4, volumen: 0.15 },
    eco: 0.6,
  },

  // Arpa: notas cortitas y suaves para los arpegios.
  arpa: {
    onda: "triangle", volumen: 0.1,
    ataque: 0.005, decaer: 0.5, sostener: 0.15, soltar: 0.5,
    eco: 0.45,
  },

  // Colchón de sonido que llena el aire de la cueva.
  pad: {
    onda: "sawtooth", volumen: 0.035,
    ataque: 1.0, decaer: 0.8, sostener: 0.7, soltar: 1.5,
    filtro: 800, desafinar: 8,
    eco: 0.5,
  },

  // Bajo profundo y redondo.
  bajo: {
    onda: "triangle", volumen: 0.26,
    ataque: 0.02, decaer: 0.6, sostener: 0.6, soltar: 0.4,
    armonico: { onda: "triangle", multiplicar: 2, volumen: 0.35 },
    eco: 0.1,
  },

  // Bajo fuerte y rápido para pelear contra el jefe.
  bajo_fuerte: {
    onda: "sawtooth", volumen: 0.14,
    ataque: 0.005, decaer: 0.12, sostener: 0.4, soltar: 0.06,
    filtro: 700,
    eco: 0,
  },

  // Voz principal del jefe: cuadrada, tensa y con vibrato.
  alarma: {
    onda: "square", volumen: 0.05,
    ataque: 0.01, decaer: 0.15, sostener: 0.7, soltar: 0.12,
    filtro: 2400, vibrato: { velocidad: 6, cantidad: 12 },
    eco: 0.3,
  },

  // ---- Tambores ----

  // Bombo: un golpe grave, ¡pum!
  bombo: {
    percusion: true,
    onda: "sine", frecuenciaInicial: 140, frecuenciaFinal: 45,
    duracion: 0.18, volumen: 0.45,
  },

  // Caja: un golpe seco con ruido, ¡pa!
  caja: {
    percusion: true,
    onda: "triangle", frecuenciaInicial: 1800, frecuenciaFinal: 900,
    ruido: 0.8, duracion: 0.12, volumen: 0.18, eco: 0.2,
  },

  // Platillo: un "tss" cortito y agudo.
  platillo: {
    percusion: true,
    frecuenciaInicial: 8000, frecuenciaFinal: 6000,
    ruido: 1, duracion: 0.05, volumen: 0.07,
  },
};
