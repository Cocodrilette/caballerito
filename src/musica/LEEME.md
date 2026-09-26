# Cómo escribir tu propia canción

1. Copia el archivo `cueva.js` y ponle otro nombre, por ejemplo `mi_cancion.js`.
2. Cambia `nombre: "cueva"` por `nombre: "mi_cancion"`.
3. Escribe tus notas. ¡Listo! Ya aparece en `herramientas/probar-sonidos.html`.

## Las palabras de la música

Cada palabra dura **un paso**. Sepáralas con espacios.

| Escribe    | Qué hace                                               |
|------------|--------------------------------------------------------|
| `C4`       | Una nota. Letra + número.                              |
| `-`        | La nota de antes sigue sonando un paso más.            |
| `.`        | Silencio.                                              |
| `C4+E4+G4` | Un acorde: varias notas juntas.                        |
| `x`        | Un golpe de tambor (en `bombo`, `caja` o `platillo`).  |
| `\|`       | Una rayita para ordenar. La música no la oye.          |

Las letras son las notas en inglés:

| C  | D  | E  | F  | G   | A  | B  |
|----|----|----|----|-----|----|----|
| Do | Re | Mi | Fa | Sol | La | Si |

- El **número** es la octava: `C3` es grave, `C5` es agudo. `C4` está en el medio.
- `#` sube la nota un poquito (`F#4`). `b` la baja un poquito (`Bb3`).

## Un ejemplo

```js
export default {
  nombre: "mi_cancion",
  tempo: 120, // pasos por minuto: más grande = más rápido
  pistas: [
    { instrumento: "campana", notas: "C4 E4 G4 - | E4 - C4 -" },
    { instrumento: "bajo",    notas: "C2 - - - | G1 - - -" },
    { instrumento: "bombo",   notas: "x . x ." },
  ],
};
```

## Instrumentos

`campana`, `cajita`, `arpa`, `pad`, `bajo`, `bajo_fuerte`, `alarma`,
`bombo`, `caja`, `platillo`.

¿Quieres inventar uno? Mira `src/audio/instrumentos.js`.

## Para que suene en el juego

Pon el nombre de tu canción en el nivel: `"musica": "mi_cancion"`.
