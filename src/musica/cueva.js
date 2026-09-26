// CANCIÓN DE LA CUEVA
// Melancólica y tranquila, en Mi menor. Dura unos 53 segundos y se repite.
//
// CÓMO SE ESCRIBE UNA CANCIÓN
//   tempo   -> pasos por minuto. Número más grande = canción más rápida.
//   pistas  -> cada pista es un instrumento tocando al mismo tiempo que los demás.
//   notas   -> palabras separadas por espacios. Cada palabra dura UN paso:
//       E4        una nota: letra (C D E F G A B) + número de octava.
//                 El número más grande suena más agudo. C4 es el Do del centro.
//       D#3 Bb2   "#" sube un poquito la nota (sostenido), "b" la baja (bemol).
//       E3+G3+B3  un acorde: varias notas a la vez, unidas con "+".
//       -         la nota anterior sigue sonando un paso más.
//       .         silencio.
//       x         en los tambores (bombo, caja, platillo) cualquier palabra es un golpe.
//       |         solo es una rayita para ordenar. La música la ignora.
//   volumen -> (opcional) 1 = normal, 0.5 = la mitad, 2 = el doble.
//
// La canción dura lo que dure su pista más larga. Las pistas más cortas
// vuelven a empezar solitas. Los instrumentos están en src/audio/instrumentos.js.
//
// Aquí cada grupo de 8 pasos entre rayitas es un "compás".

export default {
  nombre: "cueva",
  tempo: 144,
  pistas: [
    // Melodía de campana: callada al principio, entra en el compás 5.
    {
      instrumento: "campana",
      notas: `
        . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . .
        B4 - - - - - E5 - | D5 - - - B4 - - - | C5 - - - A4 - B4 - | F#4 - - - - - - -
        G4 - - - E5 - - - | D5 - - - B4 - - - | C5 - B4 - A4 - - - | G4 - - - E4 - - -
        E5 - - - G5 - - - | F#5 - - - D5 - - - | D#5 - - - B4 - - - | A4 - - - F#4 - - -
      `,
    },
    // Arpegio suave: las notas del acorde, una por una.
    {
      instrumento: "arpa",
      notas: `
        E3 B3 E4 B3 G4 B3 E4 B3 | C3 G3 B3 G3 E4 G3 C4 G3 | A2 E3 A3 E3 C4 E3 A3 E3 | B2 F#3 B3 F#3 D#4 F#3 B3 F#3
        E3 B3 E4 B3 G4 B3 E4 B3 | C3 G3 B3 G3 E4 G3 C4 G3 | A2 E3 A3 E3 C4 E3 A3 E3 | B2 F#3 B3 F#3 D#4 F#3 B3 F#3
        C3 G3 C4 G3 E4 G3 C4 G3 | B2 G3 B3 G3 D4 G3 B3 G3 | A2 E3 A3 E3 C4 E3 A3 E3 | E3 B3 E4 B3 G4 B3 E4 B3
        C3 G3 C4 G3 E4 G3 C4 G3 | D3 A3 D4 A3 F#4 A3 D4 A3 | B2 F#3 B3 F#3 D#4 F#3 B3 F#3 | B2 F#3 A3 F#3 D#4 F#3 B3 F#3
      `,
    },
    // Colchón de acordes largos, como el aire de la cueva.
    {
      instrumento: "pad",
      notas: `
        G3+B3+E4 - - - - - - - | G3+B3+E4 - - - - - - - | A3+C4+E4 - - - - - - - | F#3+B3+D#4 - - - - - - -
        G3+B3+E4 - - - - - - - | G3+B3+E4 - - - - - - - | A3+C4+E4 - - - - - - - | F#3+B3+D#4 - - - - - - -
        G3+C4+E4 - - - - - - - | G3+B3+D4 - - - - - - - | A3+C4+E4 - - - - - - - | G3+B3+E4 - - - - - - -
        G3+C4+E4 - - - - - - - | F#3+A3+D4 - - - - - - - | F#3+B3+D#4 - - - - - - - | F#3+A3+D#4 - - - - - - -
      `,
    },
    // Bajo profundo: una nota larga por compás.
    {
      instrumento: "bajo",
      notas: `
        E2 - - - - - - - | C2 - - - - - - - | A1 - - - - - - - | B1 - - - - - - -
        E2 - - - - - - - | C2 - - - - - - - | A1 - - - - - - - | B1 - - - - - - -
        C2 - - - - - - - | B1 - - - - - - - | A1 - - - - - - - | E2 - - - - - - -
        C2 - - - - - - - | D2 - - - - - - - | B1 - - - - - - - | B1 - - - - - - -
      `,
    },
  ],
};
