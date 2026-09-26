# 4. Listas y dibujos con letras 📋

## Listas

Una **lista** guarda **varias cosas en orden**. Se escribe con corchetes `[ ]`
y las cosas se separan con comas:

```js
const frutas = ["manzana", "banano", "uva"];
```

Cada cosa tiene una posición, ¡que empieza en **0**!
- `frutas[0]` es `"manzana"`
- `frutas[1]` es `"banano"`
- `frutas[2]` es `"uva"`

## Los niveles son listas de textos

Abre `niveles/nivel1.json`. El mapa es una lista de textos. **Cada texto es una
fila** y **cada letra es un bloque**:

```json
"mapa": [
  "====================",
  "=                  =",
  "=  @     $$$       >",
  "=      -----       >",
  "===================="
]
```

La leyenda (en `src/leyenda.js`) dice qué es cada letra:

| Letra | Cosa | Letra | Cosa |
|---|---|---|---|
| `=` | Suelo | `g` | Gusano |
| `-` | Plataforma | `m` | Mosquito |
| `^` | Pinchos | `e` | Escupidor |
| `@` | Inicio del jugador | `J` | Jefe |
| `B` | Banca | `*` | Cristal |
| `$` | Geo (moneda) | `h` | Hongo |
| `>` | Puerta | | |

⚠️ **Todas las filas deben tener el mismo largo.** ¡Los espacios también cuentan!

> 🔍 Abre el **Taller de Niveles** (`/editor.html`), carga `nivel1` y presiona
> **📝 Ver como texto**. ¡Es lo mismo que el archivo!

## Objetos `{ }`: cajitas con muchos compartimentos

Un **objeto** guarda cosas con **nombre**, usando llaves `{ }`:

```json
{
  "nombre": "Cueva de los Susurros",
  "musica": "cueva",
  "fondo": "#0b1020",
  "siguiente": "nivel2",
  "consejo": "Flechas para correr, Z para saltar",
  "mapa": [ ... ]
}
```

- `"nombre"` → lo que aparece al entrar al nivel.
- `"musica"` → qué canción suena (`menu`, `cueva`, `jefe`, o una tuya).
- `"fondo"` → color del fondo. Los colores se escriben `#RRGGBB` (rojo, verde, azul).
- `"siguiente"` → a qué nivel lleva la puerta.
- `"consejo"` → texto amarillo que sale al empezar.

## Los dibujos también son listas de letras

Abre `src/sprites/moneda.js`:

```js
paleta: PALETA,          // usa los colores de paleta.js
animaciones: {
  girar: { velocidad: 8, repetir: true, cuadros: [
    [ // cuadro 1
      "....oo....",
      "..ooOOoo..",
      ".oOWOOOOo.",
      ".oOWOOOOo.",
      "oOOOooOOOo",
      ...
```

- `paleta` → qué color es cada letra. Aquí `O` es oro, `o` oro oscuro, `W` blanco
  (el brillo). `"."` es **transparente** (no se pinta).
- `animaciones` → cada animación tiene varios `cuadros`.
- Cada cuadro es una **lista de filas**. Cada letra es **un píxel**.
- ¿Ves la moneda? ¡Entrecierra los ojos! 👀

Los colores compartidos están en `src/sprites/paleta.js`.
Mira todos los dibujos en grande en `/herramientas/ver-sprites.html`.

## Las canciones son textos

Abre `src/musica/cueva.js`:

```js
{ instrumento: "campana", notas: "E4 - G4 - B4 - A4 - | ..." }
```

`C D E F G A B` son `Do Re Mi Fa Sol La Si`. El número es qué tan agudo:
`C3` grave, `C5` agudo. `-` alarga la nota. `.` es silencio.
Todos los secretos están en `src/musica/LEEME.md`.

## 🧪 Experimento

1. En `src/sprites/paleta.js` busca la letra `O` (oro) y cambia `"#f0c860"` por
   `"#ff00ff"` (rosado fosforescente). ¿Cómo quedan las monedas? ¿Qué otras cosas
   cambiaron de color? (Pista: mira la banca y las plataformas. ¡Todas usan la `O`!)
2. En `niveles/nivel1.json` agrega más `$` en alguna fila (¡cambia espacios
   por `$`, sin alargar la fila!).

➡️ [Capítulo 5](05-objetos.md)
