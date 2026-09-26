// CANCIÓN DEL MENÚ
// Tranquila y misteriosa, en Re menor. Dura unos 58 segundos y se repite.
//
// CÓMO SE ESCRIBE UNA CANCIÓN
//   tempo   -> pasos por minuto. Número más grande = canción más rápida.
//   pistas  -> cada pista es un instrumento tocando al mismo tiempo que los demás.
//   notas   -> palabras separadas por espacios. Cada palabra dura UN paso:
//       D4        una nota: letra (C D E F G A B) + número de octava.
//       F#3 Bb2   "#" sube un poquito la nota, "b" la baja.
//       F3+A3+D4  un acorde: varias notas a la vez, unidas con "+".
//       -         la nota anterior sigue sonando un paso más.
//       .         silencio.
//       |         solo es una rayita para ordenar. La música la ignora.
//
// Aquí cada grupo de 8 pasos entre rayitas es un "compás".

export default {
  nombre: "menu",
  tempo: 100,
  pistas: [
    // Cajita de música con una melodía lenta.
    {
      instrumento: "cajita",
      notas: `
        . . . . . . . . | A5 - - - F5 - - - | D5 - - - - - - - | . . F5 - E5 - D5 -
        Bb4 - - - D5 - - - | G5 - - - F5 - - - | E5 - - - C#5 - - - | A4 - - - - - - -
        D5 - - - F5 - A5 - | C6 - - - A5 - - - | Bb5 - - - G5 - D5 - | C#5 - - - E5 - - -
      `,
    },
    // Acordes suaves que duran dos compases.
    {
      instrumento: "pad",
      notas: `
        F3+A3+D4 - - - - - - - - - - - - - - - | F3+Bb3+D4 - - - - - - - - - - - - - - -
        G3+Bb3+D4 - - - - - - - - - - - - - - - | E3+A3+C#4 - - - - - - - - - - - - - - -
        F3+A3+D4 - - - - - - - | F3+A3+C4 - - - - - - - | G3+Bb3+D4 - - - - - - - | E3+A3+C#4 - - - - - - -
      `,
    },
    // Gotas de agua que caen de vez en cuando.
    {
      instrumento: "arpa",
      volumen: 0.7,
      notas: `
        . . . D4 . . . A4 | . . . D4 . . . A4 | . . . D4 . . . F4 | . . . D4 . . . F4
        . . . D4 . . . G4 | . . . D4 . . . Bb4 | . . . C#4 . . . E4 | . . . C#4 . . . A4
        . . . D4 . . . A4 | . . . C4 . . . A4 | . . . D4 . . . G4 | . . . C#4 . . . E4
      `,
    },
    // Bajo lento.
    {
      instrumento: "bajo",
      notas: `
        D2 - - - - - - - | D2 - - - - - - - | Bb1 - - - - - - - | Bb1 - - - - - - -
        G1 - - - - - - - | G1 - - - - - - - | A1 - - - - - - - | A1 - - - - - - -
        D2 - - - - - - - | F2 - - - - - - - | G1 - - - - - - - | A1 - - - - - - -
      `,
    },
  ],
};
