// CANCIÓN DEL JEFE
// ¡Tensa y rápida, en Do menor! Dura unos 51 segundos y se repite.
//
// CÓMO SE ESCRIBE UNA CANCIÓN
//   tempo   -> pasos por minuto. Número más grande = canción más rápida.
//   pistas  -> cada pista es un instrumento tocando al mismo tiempo que los demás.
//   notas   -> palabras separadas por espacios. Cada palabra dura UN paso:
//       C5        una nota: letra (C D E F G A B) + número de octava.
//       Eb5 F#4   "#" sube un poquito la nota, "b" la baja.
//       -         la nota anterior sigue sonando un paso más.
//       .         silencio.
//       x         en los tambores (bombo, caja, platillo) cualquier palabra es un golpe.
//       |         solo es una rayita para ordenar. La música la ignora.
//   volumen -> (opcional) 1 = normal, 0.5 = la mitad.
//
// Las pistas de tambores son cortitas: se repiten solas todo el tiempo.
// Aquí cada grupo de 16 pasos entre rayitas es una "frase".

export default {
  nombre: "jefe",
  tempo: 300,
  pistas: [
    // La voz principal: una melodía que da nervios.
    {
      instrumento: "alarma",
      notas: `
        C5 - - - D5 - Eb5 - D5 - C5 - G4 - - - | C5 - - - D5 - Eb5 - F5 - Eb5 - D5 - - -
        Eb5 - - - C5 - - - Ab4 - - - C5 - - - | D5 - - - F5 - - - Bb4 - - - D5 - - -
        G5 - - - F5 - Eb5 - D5 - Eb5 - C5 - - - | G5 - - - Ab5 - G5 - F5 - Eb5 - D5 - - -
        Eb5 - - - - - - - C5 - - - - - - - | B4 - - - D5 - - - F5 - - - D5 - B4 -
        . . . . . . . . . . . . . . . . | . . . . . . . . Ab4 - C5 - F5 - - -
        G5 - - - - - - - Eb5 - - - - - - - | D5 - Eb5 - D5 - C5 - G4 - - - - - - -
        C5 - Eb5 - Ab5 - - - G5 - Eb5 - C5 - - - | D5 - F5 - Bb5 - - - Ab5 - F5 - D5 - - -
        B4 - D5 - G5 - - - F5 - D5 - B4 - - - | G4 - - - B4 - - - D5 - - - F5 - - -
      `,
    },
    // Bajo que corre sin parar.
    {
      instrumento: "bajo_fuerte",
      notas: `
        C2 C2 C3 C2 C2 C2 C3 C2 C2 C2 C3 C2 C2 C3 C2 C3 | C2 C2 C3 C2 C2 C2 C3 C2 C2 C2 C3 C2 C2 C3 C2 C3
        Ab1 Ab1 Ab2 Ab1 Ab1 Ab1 Ab2 Ab1 Ab1 Ab1 Ab2 Ab1 Ab1 Ab2 Ab1 Ab2 | Bb1 Bb1 Bb2 Bb1 Bb1 Bb1 Bb2 Bb1 Bb1 Bb1 Bb2 Bb1 Bb1 Bb2 Bb1 Bb2
        C2 C2 C3 C2 C2 C2 C3 C2 C2 C2 C3 C2 C2 C3 C2 C3 | C2 C2 C3 C2 C2 C2 C3 C2 C2 C2 C3 C2 C2 C3 C2 C3
        Ab1 Ab1 Ab2 Ab1 Ab1 Ab1 Ab2 Ab1 Ab1 Ab1 Ab2 Ab1 Ab1 Ab2 Ab1 Ab2 | G1 G1 G2 G1 G1 G1 G2 G1 G1 G1 G2 G1 G1 G2 G1 G2
        F1 - - - - - - - F1 - - - F2 - F1 - | F1 - - - - - - - F1 - - - F2 - F1 -
        C2 C2 C3 C2 C2 C2 C3 C2 C2 C2 C3 C2 C2 C3 C2 C3 | C2 C2 C3 C2 C2 C2 C3 C2 C2 C2 C3 C2 C2 C3 C2 C3
        Ab1 Ab1 Ab2 Ab1 Ab1 Ab1 Ab2 Ab1 Ab1 Ab1 Ab2 Ab1 Ab1 Ab2 Ab1 Ab2 | Bb1 Bb1 Bb2 Bb1 Bb1 Bb1 Bb2 Bb1 Bb1 Bb1 Bb2 Bb1 Bb1 Bb2 Bb1 Bb2
        G1 G1 G2 G1 G1 G1 G2 G1 G1 G1 G2 G1 G1 G2 G1 G2 | G1 G1 G2 G1 G1 G1 G2 G1 G1 G1 G2 G1 G1 G2 G1 G2
      `,
    },
    // Tambores: pum ... pum pum ... (8 pasos que se repiten)
    { instrumento: "bombo",    notas: "x . . x x . . ." },
    { instrumento: "caja",     notas: ". . x . . . x . | . . x . . . x x" },
    { instrumento: "platillo", notas: "x x x x x x x x" },
  ],
};
